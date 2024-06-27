import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/entity/Booking.entity';
import { User } from 'src/entity/User.entity';
import { Room } from 'src/entity/Room.entity';
import { PaymentStatus } from 'src/enum/PaymentStatus.enum';
import * as bookingData from '../../utils/booking.data.json';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async bookingSeeder() {
    try {
      for (const book of bookingData) {
        const existingUser = await this.userRepository
          .createQueryBuilder('user')
          .where('user.name = :name', { name: book.user })
          .getOne();

        if (!existingUser) {
          throw new NotFoundException(`User with name ${book.user} not found`);
        }

        const existingRoom = await this.roomRepository
          .createQueryBuilder('room')
          .where('room.roomNumber = :roomNumber', { roomNumber: book.room })
          .getOne();

        if (!existingRoom) {
          throw new NotFoundException(
            `Room with number ${book.room} not found`,
          );
        }

        const newBooking = this.bookingRepository.create({
          user: existingUser,
          room: existingRoom,
          check_in_date: new Date(book.check_in_date),
          check_out_date: new Date(book.check_out_date),
          paymentStatus: PaymentStatus.IN_PROGRESS,
        });

        await this.bookingRepository.save(newBooking);
      }
    } catch (err) {
      console.log('Error seeding data', err);
      throw new Error('Error seeding booking data');
    }
  }
}
