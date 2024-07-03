import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('createOrder')
  async createOrder(@Body() newOrder) {
    return await this.paymentService.createOrder(newOrder);
  }

  @Post('webhook')
  async webHook(@Req() request) {
    const type = request.query.type;
    if (type) {
      const id = request.query['data.id'];
      return await this.paymentService.webHook(id);
    }
  }
}
