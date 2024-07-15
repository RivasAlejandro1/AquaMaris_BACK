import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayPalService } from './paypal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesAdmin } from '../../help/roles.decoretion';
import { Role } from '../../enum/Role.enum';
import { Guard_admin } from '../../guardiane/admin_guard';
import { AuthGuard } from 'src/guardiane/auth.guard';

@ApiTags('Payments')
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

  @Post('subscription')
  async paypal(@Body() user) {
    return this.paypalService.createProduct(user.id);
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
    const eventType = request.body.event_type;
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      return await this.paypalService.suscriptionWebHook(request.body);
    }
    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      return await this.paypalService.cancelSubscriptionWebHook(request.body);
    }
    if (eventType === 'BILLING.SUBSCRIPTION.CREATED') {
      return await this.paypalService.suscriptionPenddingWebHook(request.body);
    }
    return new HttpException('OK', HttpStatus.ACCEPTED);
  }

  @Post('cancelSubscription')
  async cancelSubscription(@Body() userId) {
    console.log(userId.id);
    return await this.paypalService.cancelSubscription(userId.id);
  }
  @ApiBearerAuth()
  @Get('timeRevenue')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async timeBasedRevenue(@Query() query) {
    const { rango } = query;
    return await this.paymentService.timeBasedRevenue(rango);
  }

  @ApiBearerAuth()
  @Get('typesRevenue')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async roomBasedRevenue(@Query('rango') rango) {
    return await this.paymentService.roomBasedRevenue(rango);
  }

  @ApiBearerAuth()
  @Get('timeAndTypesRevenue')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async timeAndRoomBasedRevenue(@Query('rango') rango) {
    return await this.paymentService.timeAndRoomBasedRevenue(rango);
  }

  @ApiBearerAuth()
  @Get('typesRevenuePercent')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async roomBasedRevenuePercent(@Query('rango') rango) {
    return await this.paymentService.roomBasedRevenuePercent(rango);
  }
}
