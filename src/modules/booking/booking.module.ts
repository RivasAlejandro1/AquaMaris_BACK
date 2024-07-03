import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../../entity/Booking.entity';
import { User } from '../../entity/User.entity';
import { Room } from '../../entity/Room.entity';
import { Companion } from 'src/entity/Companion.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from 'mercadopago';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Room, Companion]),
    PaymentModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
