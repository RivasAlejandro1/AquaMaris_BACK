import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entity/Payment.entity';
import { Booking } from 'src/entity/Booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
