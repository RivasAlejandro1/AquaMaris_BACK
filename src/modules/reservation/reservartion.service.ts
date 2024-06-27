import { Controller, Injectable } from '@nestjs/common';
import { reservationRepository } from './reservartion.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: reservationRepository) {}

  async createReservation() {
    return await this.reservationRepository.createReservation();
  }
  async getAllReservation() {
    return this.reservationRepository.getAllReservation();
  }
}
