import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../entity/Room.entity';
import { RoomsRepository } from './rooms.repository';
import { Hotel } from '../../entity/Hotel.entity';
import { Service } from '../../entity/Service.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryConfig } from '../../config/cloudinary';
import { Image } from '../../entity/Image.entity';
import { Booking } from '../../entity/Booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, Service, Image, Booking])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
