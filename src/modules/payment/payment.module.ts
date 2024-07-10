import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entity/Payment.entity';
import { Booking } from 'src/entity/Booking.entity';
import { PayPalService } from './paypal.service';
import { User } from 'src/entity/User.entity';
import { Room } from 'src/entity/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking, User, Room])],
  controllers: [PaymentController],
  providers: [PaymentService, PayPalService],
  exports: [PaymentService],
})
export class PaymentModule {}
