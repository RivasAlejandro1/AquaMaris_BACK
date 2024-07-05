import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MakeBookingDto } from 'src/dtos/MakeBooking.dto';
import {  dataBookingDatesInterceptor } from 'src/interceptors/dataBookingDates.interceptor';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookingSeeder(success: boolean) {
    await this.bookingService.bookingSeeder();
  }

  @Post()
  @UseInterceptors(dataBookingDatesInterceptor)
  async makeBooking(@Body() infoBooking: MakeBookingDto){
    return await this.bookingService.makeBooking(infoBooking)
  }
}
