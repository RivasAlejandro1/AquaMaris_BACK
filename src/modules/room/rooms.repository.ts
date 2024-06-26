import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entity/Reservation.entity';
import { Room } from 'src/entity/Room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
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
    const { arrive, types, services } = filters;
    const availableRooms = await this.reserveredRooms(arrive);
    console.log(availableRooms);

    if (types && services) {
      const typesFiltered = this.getByType(types, availableRooms);
      return this.getByServices(services, typesFiltered);
    } else if (types && !services) {
      return this.getByType(types, availableRooms);
    } else if (!types && services) {
      return this.getByServices(services, availableRooms);
    }
    //return this.AllRooms;
    return availableRooms;
  }

  async reserveredRooms(arrive: Date) {
    const reserveredRoomsId = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('reservation.room.id', 'room_id')
      .where('reservation.depart_date > :arrive', { arrive })
      .getRawMany()
      .then((results) => results.map((result) => result.room_id));

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
      services.every((serviceId) =>
        room.services.some((service) => service.id === serviceId),
      ),
    );
  }

  getByType(types, rooms) {
    return rooms.filter((room) => types.includes(room.type));
  }
}
