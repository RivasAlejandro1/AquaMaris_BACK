import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entity/Payment.entity';
import { Booking } from 'src/entity/Booking.entity';
import { PayPalService } from './paypal.service';
import { User } from 'src/entity/User.entity';
import { Room } from 'src/entity/Room.entity';
import { PromotionService } from '../promotion/promotion.service';
import { Promotion } from 'src/entity/Promotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking, User, Room, Promotion]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PayPalService, PromotionService],
  exports: [PaymentService],
})
export class PaymentModule {}
