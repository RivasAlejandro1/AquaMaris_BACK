import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Booking } from '../../entity/Booking.entity';
import { User } from '../../entity/User.entity';
import { Room } from '../../entity/Room.entity';
import { PaymentStatus } from '../../enum/PaymentStatus.enum';
import * as bookingData from '../../utils/booking.data.json';
import { Companion } from 'src/entity/Companion.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Companion)
    private companionRepository: Repository<Companion>,
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

        const existingBooking = await this.bookingRepository
          .createQueryBuilder('booking')
          .where('booking.user = :user', { user: existingUser.id })
          .andWhere('booking.room = :room', { room: existingRoom.id })
          .andWhere('booking.check_in_date = :check_in_date', {
            check_in_date: new Date(book.check_in_date),
          })
          .andWhere('booking.check_out_date = :check_out_date', {
            check_out_date: new Date(book.check_out_date),
          })
          .getOne();

        if (existingBooking) {
          console.log(
            `Booking for user ${book.user} in room ${book.room} already exists`,
          );
          continue;
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
      return true;
    } catch (err) {
      console.log('Error seeding data', err);
      throw new Error('Error seeding booking data');
    }
  }

  async makeBooking(infoBooking: any){
    const {
      check_in_date, 
      check_out_date, 
      userId, 
      roomId, 
      companions,
      ...infoCreateBooking
    } = infoBooking;
    const paymentStatus = PaymentStatus.PENDING
    
    const newBooking : Booking = this.bookingRepository.create({check_in_date, check_out_date});

    try{
      const roomFinded = await this.roomRepository.findOneByOrFail({ id: roomId })
      newBooking.room = roomFinded;
    }catch(error){
      if(error.name == "EntityNotFoundError") throw new NotFoundException(`The found the room with id: ${roomId}`)
      console.log(error)
      console.log(error.name)
      throw new InternalServerErrorException("Conection error DB")
    }

  
    try{
      const userFinded = await this.userRepository.findOneByOrFail({ id: userId })
      newBooking.user = userFinded;
    }catch(error){
      if(error.name == "EntityNotFoundError") throw new NotFoundException(`The found the user with id: ${userId}`)
      console.log(error)
      throw new InternalServerErrorException("Conection error DB")
    } 

    const result = await this.bookingRepository.save(newBooking)
    try{
      if(companions){
        await Promise.all( 
          companions.map(
            async companion => {
              const {name , identityCard } = companion
              const newCompanion = this.companionRepository.create({name , identityCard });
              newCompanion.booking = newBooking;
              await this.companionRepository.save(newCompanion)
            }
          )
        )
      }
    }catch(error){
      if(error.name == "EntityNotFoundError") throw new NotFoundException(`The found the user with id: ${userId}`)
      console.log(error)
      console.log(error.name)
      throw new InternalServerErrorException("Conection error DB")
    } 


    
    return result;
    
  }
}
