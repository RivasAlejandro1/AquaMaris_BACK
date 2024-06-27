import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hotel } from "src/entity/Hotel.entity";
import { Repository } from "typeorm";
import * as hotels from '../../utils/hotels.data.json'

@Injectable()
export class HotelService {
    constructor(@InjectRepository(Hotel) private hotelRepository: Repository<Hotel>) { }

    async hotelSeeder() {
        try{
            for(const hotel of hotels){
                const existingHotel = await this.hotelRepository
                    .createQueryBuilder('hotel')
                    .where('hotel.name =:name', {name: hotel.name})
                    .getOne()

                const newHotel = await this.hotelRepository.create({
                    name: hotel.name,
                    direction: hotel.direction,
                    phoneNumber: hotel.phoneNumber,
                    email: hotel.email,
                    description: hotel.description,
                })

                await this.hotelRepository.save(newHotel)
            }
        }catch(err){
            console.log('Error seeding hotels from hotels.data.json ', err)
            throw new Error('Error seeding hotels')
        }
    }
}