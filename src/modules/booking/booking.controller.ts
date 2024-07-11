import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { MakeBookingDto } from 'src/dtos/MakeBooking.dto';
import { dataBookingDatesInterceptor } from 'src/interceptors/dataBookingDates.interceptor';
import { areIntervalsOverlapping, interval, parseISO } from 'date-fns';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookingSeeder(success: boolean) {
    await this.bookingService.bookingSeeder();
  }

  @Get('forMonths')
  async findBookingsByMonths(@Body() infoRango) {
    const { rango } = infoRango;
    return await this.bookingService.findBookingsByMonths(rango);
  }

  @Get('forMonths/typeRoom')
  async findBookingsByMonthsWithTypeRoom(@Body() infoRango) {
    const { rango } = infoRango;
    return await this.bookingService.findBookingsByMonthsWithTypeRoom(rango);
  }

  @Get('forMonths/typeRoom/porcent')
  async findBookingsByMonthsWithTypeRoomPorcent(@Body() infoRango) {
    const { rango } = infoRango;
    return await this.bookingService.findBookingsByMonthsWithTypeRoomPorcent(
      rango,
    );
  }

  @Post()
  @UseInterceptors(dataBookingDatesInterceptor)
  async makeBooking(@Body() infoBooking: MakeBookingDto) {
    return await this.bookingService.makeBooking(infoBooking);
  }

  @Get(':id')
  async getAllBookingsById(@Param('id') id: string) {
    return await this.bookingService.getAllBookingsById(id);
  }

  @Post('cancel')
  async cancelBooking(@Body() data) {
    const { userId, bookingId } = data;
    return await this.bookingService.cancelBooking(userId, bookingId);
  }
}
