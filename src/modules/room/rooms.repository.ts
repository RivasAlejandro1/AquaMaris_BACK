import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entity/Room.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/rooms.data.json';
import { Service } from 'src/entity/Service.entity';
import { Hotel } from 'src/entity/Hotel.entity';
import { Image } from 'src/entity/Image.entity';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Hotel) private hotelRepository: Repository<Hotel>,
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
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

  async roomSeeder() {
    try {
      for (const dato of data) {
        const existingHotel = await this.hotelRepository
          .createQueryBuilder('hotel')
          .where('hotel.name =:name', { name: dato.hotel })
          .getOne();

        if (existingHotel) {
          const existingRoom = await this.roomsRepository
            .createQueryBuilder('room')
            .where('room.roomNumber =:roomNumber', {
              roomNumber: dato.roomNumber,
            })
            .getOne();

          if (existingRoom) {
            const service = await this.serviceRepository
              .createQueryBuilder('service')
              .where('service.name IN (:...names)', { names: dato.services })
              .getMany();

            if (!service) {
              console.log(
                `Service ${dato.services} not found for room ${dato.roomNumber}`,
              );
              continue;
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

            await this.roomsRepository.save(newRoom);
          }
        } else {
          console.log('Hotel does not exist');
          throw new NotFoundException('Hotel not found');
        }
      }
    } catch {
      throw new BadRequestException('Error seeding rooms');
    }
  }
}
