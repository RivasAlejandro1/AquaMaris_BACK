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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Guard_admin } from 'src/guardiane/admin_guard';
import { Role } from 'src/enum/Role.enum';
import { RolesAdmin } from 'src/help/roles.decoretion';
import { AuthGuard } from 'src/guardiane/auth.guard';

@ApiTags('Bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async bookingSeeder(success: boolean) {
    await this.bookingService.bookingSeeder();
  }

  @ApiBearerAuth()
  @Get('forMonths')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async findBookingsByMonths(@Query('rango') rango): Promise<any[]> {
    return await this.bookingService.findBookingsByMonths(Number(rango));
  }

  @ApiBearerAuth()
  @Get('forMonths/typeRoom')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async findBookingsByMonthsWithTypeRoom(@Query('rango') rango) {
    return await this.bookingService.findBookingsByMonthsWithTypeRoom(rango);
  }

  @ApiBearerAuth()
  @Get('forMonths/typeRoom/porcent')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async findBookingsByMonthsWithTypeRoomPorcent(@Query('rango') rango) {
    return await this.bookingService.findBookingsByMonthsWithTypeRoomPorcent(
      rango,
    );
  }

  @ApiBearerAuth()
  @Post()
  @RolesAdmin(Role.USER)
  @UseGuards(AuthGuard, Guard_admin)
  @UseInterceptors(dataBookingDatesInterceptor)
  async makeBooking(@Body() infoBooking: MakeBookingDto) {
    return await this.bookingService.makeBooking(infoBooking);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RolesAdmin(Role.USER)
  @UseGuards(AuthGuard, Guard_admin)
  async getAllBookingsById(@Param('id') id: string) {
    return await this.bookingService.getAllBookingsById(id);
  }

  @ApiBearerAuth()
  @Post('cancel')
  @RolesAdmin(Role.USER)
  @UseGuards(AuthGuard, Guard_admin)
  async cancelBooking(@Body() data) {
    const { userId, bookingId } = data;
    return await this.bookingService.cancelBooking(userId, bookingId);
  }
}
