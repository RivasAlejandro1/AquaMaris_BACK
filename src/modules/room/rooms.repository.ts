import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entity/Reservation.entity';
import { Hotel } from 'src/entity/Hotel.entity';
import { Room } from 'src/entity/Room.entity';
import { Service } from 'src/entity/Service.entity';
import { Repository } from 'typeorm';
import * as infoSeederHotels from '../../utils/hotels.json';
import * as infoSeederServices from '../../utils/services.json';
import { Image } from 'src/entity/Image.entity';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Room) private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getAllRooms(page, limit) {
    const offset = (page - 1) * limit;
    const allRooms = await this.roomsRepository.find({
      relations: {
        services: true,
        images: true,
      },
      skip: offset,
      take: limit,
    });
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

  async reserveredRooms(arrive: Date, depart?: Date) {
    const reserveredRoomsId = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('reservation.roomId', 'room_id')
      .where(
        depart
          ? '(reservation.entrance >= :entrance AND reservation.entrance < :exit) OR (reservation."exit" > :entrance AND reservation."exit" <= :exit) OR (reservation.entrance <= :entrance AND reservation."exit" >= :exit) OR (reservation.entrance >= :entrance AND reservation."exit" <= :exit)'
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

  async createRoom(infoRoom) {
    const {
      type,
      price,
      description,
      state,
      roomNumber,
      hotel_id,
      services_id,
    } = infoRoom;

    const newRoom = this.roomsRepository.create({
      type,
      price,
      description,
      state,
      roomNumber,
    });

    const findedHotel = await this.hotelRepository.findOneBy({ id: hotel_id });
    console.log(findedHotel);
    newRoom.hotel = findedHotel;

    const allServicesFinded = await Promise.all(
      services_id.map(async (id) => {
        return await this.serviceRepository.findOneBy({ id });
      }),
    );
    newRoom.services = allServicesFinded;

    await this.roomsRepository.save(newRoom);

    return await this.roomsRepository.find({
      relations: {
        hotel: true,
        services: true,
        images: true,
      },
    });
  }

  async seederAllAboutRoom() {
    await Promise.all(
      infoSeederHotels.map(async (infoHotel) => {
        const newHotel = this.hotelRepository.create(infoHotel);
        await this.hotelRepository.save(newHotel);
      }),
    );

    await Promise.all(
      infoSeederServices.map(async (infoServie) => {
        const newHotel = this.serviceRepository.create(infoServie);
        await this.serviceRepository.save(newHotel);
      }),
    );

    const allHotels = await this.hotelRepository.find({
      relations: {
        rooms: true,
      },
    });
    const allServices = await this.serviceRepository.find();

    return {
      message: 'The hotels and services was created',
      info: { allHotels, allServices },
    };
  }
}
