import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entity/Room.entity';
import { RoomsRepository } from './rooms.repository';
<<<<<<< HEAD
import { Reservation } from 'src/entity/Reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Reservation])],
=======
import { Hotel } from 'src/entity/Hotel.entity';
import { Service } from 'src/entity/Service.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryConfig, } from 'src/config/cloudinary';
import { Image } from 'src/entity/Image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, Service, Image])],
>>>>>>> develop
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
