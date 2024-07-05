import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
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

   /*  const {check_in_date, check_out_date} = infoBooking
    console.log("DatesOfBody: ", check_in_date, check_out_date)
    const start1 = check_in_date
    const end1 = check_out_date
    const interval1 = interval(start1, end1)
    
    const start2 = new Date(2024,11,21)
    const end2 = new Date(2024,11,22)
    const interval2 = interval(start2, end2)
    
    console.log("interval1",interval1)
    console.log("interval2",interval2)
    
    console.log("result: ", areIntervalsOverlapping(interval1, interval2)) */
    return await this.bookingService.makeBooking(infoBooking)
  }
}
