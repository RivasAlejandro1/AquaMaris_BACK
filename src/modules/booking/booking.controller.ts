import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MakeBookingDto } from 'src/dtos/MakeBooking.dto';
import {  dataBookingDatesInterceptor } from 'src/interceptors/dataBookingDates.interceptor';
import { areIntervalsOverlapping, interval, parseISO } from 'date-fns';

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

  @Get(":id")
  async getAllBookingsById(@Param("id") id: string){
    return await this.bookingService.getAllBookingsById(id)
  }
}
