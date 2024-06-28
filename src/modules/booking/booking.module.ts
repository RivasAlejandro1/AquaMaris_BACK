import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../../entity/Booking.entity';
import { User } from '../../entity/User.entity';
import { Room } from '../../entity/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Room])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
