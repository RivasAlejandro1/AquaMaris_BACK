import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { MakeBookingDto } from 'src/dtos/MakeBooking.dto';
import { dataBookingDatesInterceptor } from 'src/interceptors/dataBookingDates.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Guard_admin } from 'src/guardiane/admin_guard';
import { Role } from 'src/enum/Role.enum';
import { RolesAdmin } from 'src/help/roles.decoretion';

@UseGuards(Guard_admin)
@ApiTags('Bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookingSeeder(success: boolean) {
    await this.bookingService.bookingSeeder();
  }

  @Get('forMonths')
  @RolesAdmin(Role.ADMIN)
  async findBookingsByMonths(@Query('rango') rango): Promise<any[]> {
    return await this.bookingService.findBookingsByMonths(Number(rango));
  }

  @Get('forMonths/typeRoom')
  @RolesAdmin(Role.ADMIN)
  async findBookingsByMonthsWithTypeRoom(@Query('rango') rango) {
    return await this.bookingService.findBookingsByMonthsWithTypeRoom(rango);
  }

  @Get('forMonths/typeRoom/porcent')
  @RolesAdmin(Role.ADMIN)
  async findBookingsByMonthsWithTypeRoomPorcent(@Query('rango') rango) {
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

  @RolesAdmin(Role.USER)
  @Post('cancel')
  async cancelBooking(@Body() data) {
    const { userId, bookingId } = data;
    return await this.bookingService.cancelBooking(userId, bookingId);
  }
}
