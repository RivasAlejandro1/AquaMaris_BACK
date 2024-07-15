import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../../entity/Hotel.entity';
import { Room } from '../../entity/Room.entity';
import { Service } from '../../entity/Service.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/rooms.data.json';
import { Image } from '../../entity/Image.entity';
import { Booking } from '../../entity/Booking.entity';
import { isThisWeek } from 'date-fns';
import { PaymentStatus } from 'src/enum/PaymentStatus.enum';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Hotel) private hotelRepository: Repository<Hotel>,
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async getAllRooms(page, limit) {
    const offset = (page - 1) * limit;
    const allRoomsQuery = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.services', 'services')
      .leftJoinAndSelect('room.images', 'images')
      .leftJoinAndSelect(
        'room.bookings',
        'bookings',
        'bookings.check_in_date >= :today',
        {
          today: new Date().toISOString().split('T')[0],
        },
      )
      .select([
        'room.id',
        'room.type',
        'room.price',
        'room.description',
        'room.state',
        'room.roomNumber',
        'services',
        'images',
        'bookings.check_in_date',
        'bookings.check_out_date',
      ]);
    const totalCount = await allRoomsQuery.getCount();

    const totalPages = Math.ceil(totalCount / limit);

    const allRooms = await allRoomsQuery.skip(offset).take(limit).getMany();
    //console.log({ allRooms, totalPages });
    return { totalPages, allRooms };
  }

  async filterRoom(filters) {
    const { arrive, departure_date, types, services, people, sort } = filters;
    let { page } = filters;
    if (!page) page = 1;
    const pageSize = 3;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let availableRooms = await this.reserveredRooms(
      arrive,
      departure_date,
      sort,
    );

    if (people) availableRooms = this.getByPeople(people, availableRooms);

    if (types) availableRooms = this.getByType(types, availableRooms);

    if (services) availableRooms = this.getByServices(services, availableRooms);
    const totalPages = Math.ceil(availableRooms.length / pageSize);
    const allRooms = availableRooms.slice(startIndex, endIndex);
    return { totalPages, allRooms };
  }

  async reserveredRooms(arrive: Date, depart?: Date, orderBy?) {
    const reserveredRoomsId = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('booking.roomId', 'room_id')
      .where(
        depart
          ? `((booking.check_in_date >= :check_in_date AND booking.check_in_date <= :exit)
         OR (booking.check_out_date >= :check_in_date AND booking.check_out_date <= :exit)
         OR (booking.check_in_date <= :check_in_date AND booking.check_out_date >= :exit)
         OR (booking.check_in_date >= :check_in_date AND booking.check_out_date <= :exit))
         AND booking.paymentStatus != :paymentStatus`
          : 'booking.check_in_date <= :check_in_date AND booking.check_out_date >= :check_in_date AND booking.paymentStatus != :paymentStatus',
        {
          check_in_date: arrive,
          exit: depart,
          paymentStatus: PaymentStatus.CANCELLED,
        },
      )
      .getRawMany()
      .then((results) => results.map((result) => result.room_id));
    if (reserveredRoomsId.length === 0) {
      let roomsQuery = this.roomsRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.services', 'service')
        .leftJoinAndSelect('room.images', 'image')
        .where('room.state = :state', { state: 'available' });

      if (orderBy === 'ASC') {
        roomsQuery = roomsQuery.orderBy('room.price', 'ASC');
      } else if (orderBy === 'DESC') {
        roomsQuery = roomsQuery.orderBy('room.price', 'DESC');
      } else if (orderBy === undefined) {
        roomsQuery = roomsQuery.orderBy('room.id', 'ASC');
      }

      const notReserveredRooms = await roomsQuery.getMany();
      return notReserveredRooms;
    }
    const query = this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.services', 'service')
      .leftJoinAndSelect('room.images', 'image')
      .where('room.id NOT IN (:...reserveredRoomsId)', { reserveredRoomsId })
      .andWhere('room.state != :state', { state: 'mantenimiento' });
    if (orderBy === 'ASC') {
      query.orderBy('room.price', 'ASC');
    } else if (orderBy === 'DESC') {
      query.orderBy('room.price', 'DESC');
    } else {
      query.orderBy('room.id', 'ASC');
    }
    const notReservedRooms = await query.getMany();
    return notReservedRooms;
  }

  getByServices(services, rooms) {
    return rooms.filter((room) =>
      services.every((serviceName) =>
        room.services.some((service) => service.name === serviceName),
      ),
    );
  }

  getByType(types, rooms) {
    return rooms.filter((room) => types.some((type) => room.type === type));
  }

  getByPeople(capacity, rooms) {
    const capacityMap: { [key: number]: string[] } = {
      1: ['standard', 'double', 'deluxe', 'suite', 'family'],
      2: ['standard', 'double', 'deluxe', 'Suite', 'family'],
      3: ['deluxe', 'suite', 'family'],
      4: ['suite', 'family'],
      5: ['family'],
      6: ['family'],
    };
    const roomTypes = capacityMap[capacity] || [];

    return rooms.filter((room) => roomTypes.includes(room.type));
  }
  async getRoomById(id) {
    return this.roomsRepository.findOneBy({ id });
  }
  //! CURRENT
  async createRoom(infoRoom) {
    const { type, price, description, state, roomNumber, services, images } =
      infoRoom;

    const newRoom = this.roomsRepository.create({
      type,
      price,
      description,
      state,
      roomNumber,
    });

    let hotelFound: any;
    try {
      hotelFound = infoRoom.hotel
        ? { id: infoRoom.hotel }
        : await this.hotelRepository.findOne({
            where: {
              name: "AquaMaris Hotel's Beach",
            },
            select: ['id'],
          });
    } catch (Error) {
      throw new NotFoundException();
    }
    const hotelID = hotelFound.id;

    try {
      const findedHotel = await this.hotelRepository.findOneOrFail({
        where: {
          id: hotelID,
        },
      });
      newRoom.hotel = findedHotel;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `Hotel with name ${hotelID} not exist in DB`,
        );
      } else {
        console.log(error);
        throw new InternalServerErrorException('');
      }
    }

    let currentName: string;
    try {
      const allServicesFinded = !services
        ? []
        : await Promise.all(
            services.map(async (name) => {
              currentName = name;
              const service = await this.serviceRepository.findOneOrFail({
                where: {
                  name,
                },
              });
              return service;
            }),
          );
      newRoom.services = allServicesFinded;
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException(
          `Service with name ${currentName} not exist in DB`,
        );
      } else {
        throw new InternalServerErrorException(`Database connection error`);
      }
    }

    try {
      const allImageMaked = !images
        ? []
        : await Promise.all(
            images.map(async (url) => {
              const newImage = this.imagesRepository.create({ url });
              newImage.date = new Date();
              return await this.imagesRepository.save(newImage);
            }),
          );
      newRoom.images = allImageMaked;
      return await this.roomsRepository.save(newRoom);
    } catch (error) {
      throw new InternalServerErrorException('Database connection error');
    }
  }

  async roomSeeder() {
    try {
      for (const dato of data) {
        const existingHotel = await this.hotelRepository
          .createQueryBuilder('hotel')
          .where('hotel.name = :name', { name: dato.hotel })
          .getOne();

        if (!existingHotel) {
          throw new NotFoundException(`Hotel ${dato.hotel} not found`);
        }

        const existingRoom = await this.roomsRepository
          .createQueryBuilder('room')
          .where('room.roomNumber = :roomNumber', {
            roomNumber: dato.roomNumber,
          })
          .getOne();

        if (existingRoom) {
          continue;
        }

        const services = await this.serviceRepository
          .createQueryBuilder('service')
          .where('service.name IN (:...names)', { names: dato.services })
          .getMany();

        if (!services.length) {
          throw new NotFoundException('Services not found');
        }

        const images = await Promise.all(
          dato.images.map(async (url) => {
            const images = this.imagesRepository.create({
              url,
              date: new Date(),
            });
            await this.imagesRepository.save(images);
            return images;
          }),
        );

        const newRoom = this.roomsRepository.create({
          type: dato.type,
          price: dato.price,
          description: dato.description,
          state: dato.state,
          roomNumber: dato.roomNumber,
          services: services,
          hotel: existingHotel,
          images: images,
        });
        await this.roomsRepository.save(newRoom);
      }
      return true;
    } catch (error) {
      console.error('Error seeding rooms:', error);
      throw new BadRequestException('Error seeding rooms');
    }
  }

  async getById(id) {
    return await this.roomsRepository.findOne({
      where: { id: id },
      relations: {
        bookings: true,
        services: true,
        images: true,
      },
    });
  }

  async getByNum(num: number) {
    return await this.roomsRepository.findOne({
      where: { roomNumber: num },
      relations: {
        bookings: true,
        services: true,
        images: true,
      },
    });
  }

  async changeRoom(infoRoom) {
    const { id, ...allChanges } = infoRoom;
    return await this.roomsRepository.update({ id }, allChanges);
  }
}
