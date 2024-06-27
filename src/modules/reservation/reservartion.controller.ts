import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReservationService } from './reservartion.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async getAllReservation() {
    return await this.reservationService.getAllReservation();
  }

  @Post()
  async createReservation() {
    return await this.reservationService.createReservation();
  }
}
