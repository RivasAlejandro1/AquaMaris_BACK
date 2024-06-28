import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entity/Hotel.entity';
import { Room } from 'src/entity/Room.entity';
import { Service } from 'src/entity/Service.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/rooms.data.json';
import { Image } from 'src/entity/Image.entity';
import { Booking } from 'src/entity/Booking.entity';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Hotel) private hotelRepository: Repository<Hotel>,
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
    @InjectRepository(Booking)
    private reservationsRepository: Repository<Booking>,
  ) {}

  async getAllRooms(page, limit) {
    const offset = (page - 1) * limit;
    const allRooms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.services', 'services')
      .leftJoinAndSelect('room.images', 'images')
      .leftJoinAndSelect(
        'room.reservations',
        'reservations',
        'reservations."exit" >= :today',
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
        'reservations.entrance',
        'reservations.exit',
      ])
      .skip(offset)
      .take(limit)
      .getMany();

    return allRooms;
  }

  async filterRoom(filters) {
    const { arrive, departure_date, types, services, people } = filters;
    let { page } = filters;
    if (!page) page = 1;
    const pageSize = 3;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let availableRooms = await this.reserveredRooms(arrive, departure_date);

    if (people) availableRooms = this.getByPeople(people, availableRooms);

    if (types) availableRooms = this.getByType(types, availableRooms);

    if (services) availableRooms = this.getByServices(services, availableRooms);

    const paginatedRooms = availableRooms.slice(startIndex, endIndex);
    return paginatedRooms;
  }

  async createRoom(infoRoom){
      const { type, price, description, state, roomNumber, hotel, services, images} = infoRoom;

      const newRoom = this.roomsRepository.create({ type, price, description, state, roomNumber})

      const  findedHotel =  await this.hotelRepository.findOneBy({id: hotel})
      newRoom.hotel = findedHotel;

      const allServicesFinded =  await Promise.all( services.map( async id => {
        return  await this.serviceRepository.findOneBy({id})
      }))
      newRoom.services = allServicesFinded;

      const allImageMaked =  await Promise.all( images.map( async url => {
        
        const newImage = this.imagesRepository.create({url});
        newImage.date = new Date();
        //newImage.room = newRoom
        
        const saveImage = await this.imagesRepository.save(newImage)
        return saveImage;
        
      }))
      newRoom.images = allImageMaked;
      
      await this.roomsRepository.save(newRoom);
      
      return newRoom;
    }
  async reserveredRooms(arrive: Date, depart?: Date) {
    const reserveredRoomsId = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('reservation.roomId', 'room_id')
      .where(
        depart
          ? '(reservation.entrance >= :entrance AND reservation.entrance <= :exit) OR (reservation."exit" >= :entrance AND reservation."exit" <= :exit) OR (reservation.entrance <= :entrance AND reservation."exit" >= :exit) OR (reservation.entrance >= :entrance AND reservation."exit" <= :exit)'
          : 'reservation.entrance <= :entrance AND reservation."exit" >= :entrance',
        { entrance: arrive, exit: depart },
      )
      .getRawMany()
      .then((results) => results.map((result) => result.room_id));
    if (reserveredRoomsId.length === 0) {
      return await this.roomsRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.services', 'service')
        .where('room.state = :state', { state: 'AVAILABLE' })
        .getMany();
    }
    const notReserveredRomms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.services', 'service')
      .leftJoinAndSelect('room.images', 'image')
      .where('room.id NOT IN (:...reserveredRoomsId)', { reserveredRoomsId })
      .andWhere('room.state != :state', { state: 'mantenimiento' })
      .getMany();
    return notReserveredRomms;
  }

  getByServices(services, rooms) {
    return rooms.filter((room) =>
      services.every((serviceName) =>
        room.services.some((service) => service.name === serviceName),
      ),
    );
  }

  getByType(types, rooms) {
    return rooms.filter((room) => types.includes(room.type));
  }

  getByPeople(capacity, rooms) {
    const capacityMap: { [key: number]: string[] } = {
      1: ['Estandar', 'Doble', 'Deluxe', 'Suite', 'Familiar'],
      2: ['Estandar', 'Doble', 'Deluxe', 'Suite', 'Familiar'],
      3: ['Deluxe', 'Suite', 'Familiar'],
      4: ['Suite', 'Familiar'],
      6: ['Familiar'],
    };
    const roomTypes = capacityMap[capacity] || [];

    return rooms.filter((room) => roomTypes.includes(room.type));
  }
  async getRoomById(id) {
    return this.roomsRepository.findOneBy({ id });
  }


  async roomSeeder() {
    try {
      for (const dato of data) {
        const existingHotel = await this.hotelRepository
          .createQueryBuilder('hotel')
          .where('hotel.name = :name', { name: dato.hotel })
          .getOne();

        if (existingHotel) {
          const existingRoom = await this.roomsRepository
            .createQueryBuilder('room')
            .where('room.roomNumber = :roomNumber', {
              roomNumber: dato.roomNumber,
            })
            .getOne();

          if (!existingRoom) {
            const service = await this.serviceRepository
              .createQueryBuilder('service')
              .where('service.name IN (:...names)', { names: dato.services })
              .getMany();

            if (!service) {
              throw new NotFoundException('Services not found');
            }

            const images = await this.imagesRepository
              .createQueryBuilder('image')
              .where('image.url IN (:...urls)', { urls: dato.images })
              .getMany();

            const newRoom = this.roomsRepository.create({
              type: dato.type,
              price: dato.price,
              description: dato.description,
              state: dato.state,
              roomNumber: dato.roomNumber,
              services: service,
              hotel: existingHotel,
              images: images,
            });

            console.log(newRoom);
            await this.roomsRepository.save(newRoom);
          } else {
          }
        } else {
          throw new NotFoundException(`Hotel ${dato.hotel} not found`);
        }
      }
      return true;
    } catch (error) {
      console.error('Error seeding rooms:', error);
      throw new BadRequestException('Error seeding rooms');
    }
  }
}
