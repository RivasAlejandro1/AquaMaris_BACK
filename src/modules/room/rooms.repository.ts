import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entity/Hotel.entity';
import { Room } from 'src/entity/Room.entity';
import { Service } from 'src/entity/Service.entity';
import { Repository } from 'typeorm';
import * as infoSeederHotels from  "../../utils/hotels.json";
import * as infoSeederServices from  "../../utils/services.json";
import { Image } from 'src/entity/Image.entity';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room) private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Hotel) private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>
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

  async getRoomById(id){
    return this.roomsRepository.findOneBy({id})
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

      await this.roomsRepository.save(newRoom);


      const allImageMaked =  await Promise.all( images.map( async url => {
        
        const newImage = this.imageRepository.create({url});
        newImage.date = new Date();
        newImage.room = newRoom
        
        const saveImage = await this.imageRepository.save(newImage)
        return saveImage;
        
      }))
      newRoom.images = allImageMaked;
      
      return newRoom;
  }

  async seederAllAboutRoom(){
      await Promise.all(infoSeederHotels.map( async infoHotel => {
        const newHotel = this.hotelRepository.create(infoHotel)
        await this.hotelRepository.save(newHotel)
      }))

      await Promise.all( infoSeederServices.map( async infoServie => {
        const newHotel = this.serviceRepository.create(infoServie)
        await this.serviceRepository.save(newHotel)
      }))

      const allHotels = await this.hotelRepository.find({
        relations: {
            rooms: true
        },
    })
      const allServices = await this.serviceRepository.find()

      return { message: "The hotels and services was created", info: { allHotels, allServices}  }
  }
}
