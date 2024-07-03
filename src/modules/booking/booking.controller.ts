import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MakeBookingDto } from 'src/dtos/MakeReservation.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookingSeeder(success: boolean) {
    await this.bookingService.bookingSeeder();
  }

  @Post()
  async makeBooking(@Body() infoBooking: MakeBookingDto) {
    console.log(infoBooking);
    console.log(new Date());
    return await this.bookingService.makeBooking(infoBooking);
  }
}
