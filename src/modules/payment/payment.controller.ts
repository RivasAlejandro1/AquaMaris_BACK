import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayPalService } from './paypal.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paypalService: PayPalService,
  ) {}

  @Post('createOrder')
  async createOrder(@Body() newOrder) {
    return await this.paymentService.createOrder(newOrder);
  }

  /* @Post('subscription')
  async createPreApprobalPla(@Body() cardFormData) {
    return await this.paymentService.createPreApprobalPlan(cardFormData);
  } */

  @Post('subscription')
  async paypal() {
    return this.paypalService.createProduct();
  }
  @Post('webhook')
  async webHook(@Req() request) {
    const type = request.query.type;
    if (type) {
      const id = request.query['data.id'];
      return await this.paymentService.webHook(id);
    }
  }

  @Post('subswebhook')
  async subsWebHook(@Req() request) {
    console.log('hola');
    console.log(request.body);
    return new HttpException('OK', HttpStatus.ACCEPTED);
  }
}
