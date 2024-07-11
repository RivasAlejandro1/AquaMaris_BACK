import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
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

  @Get("forMonths")
  async findBookingsByMonths(@Query("rango") rango){
    return await this.bookingService.findBookingsByMonths(Number(rango))
  }

  @Get("forMonths/typeRoom")
  async findBookingsByMonthsWithTypeRoom(@Query("rango") rango){
    return await this.bookingService.findBookingsByMonthsWithTypeRoom(rango)
  }

  @Get("forMonths/typeRoom/porcent")
  async findBookingsByMonthsWithTypeRoomPorcent(@Query("rango") rango){
    return await this.bookingService.findBookingsByMonthsWithTypeRoomPorcent(rango)
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
