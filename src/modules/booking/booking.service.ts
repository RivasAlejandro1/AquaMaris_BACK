import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Booking } from '../../entity/Booking.entity';
import { User } from '../../entity/User.entity';
import { Room } from '../../entity/Room.entity';
import { PaymentStatus } from '../../enum/PaymentStatus.enum';
import * as bookingData from '../../utils/booking.data.json';
import { Companion } from 'src/entity/Companion.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from 'src/entity/Payment.entity';
import {
  areIntervalsOverlapping,
  format,
  formatISO,
  interval,
  isBefore,
  parseISO,
  subDays,
} from 'date-fns';
import { Exception } from 'handlebars';
import { MailService } from '../mail/mail.service';
import { MailDto } from 'src/dtos/Mail.dto';
import { MailType } from 'src/enum/MailType.dto';
import { PromotionService } from '../promotion/promotion.service';
import { all } from 'axios';
import { TypesRooms } from 'src/enum/RoomTypes.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Promotion } from 'src/entity/Promotion.entity';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';

@Injectable()
export class BookingService {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Companion)
    private companionRepository: Repository<Companion>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    private promotionService: PromotionService,
    private mailService: MailService,
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

  async makeBooking(infoBooking: any) {
    const {
      check_in_date,
      check_out_date,
      userId,
      roomId,
      companions,
      promotionCode,
    } = infoBooking;
    const paymentStatus = PaymentStatus.PENDING;
    const promotionCodeFinded = await this.promotionRepository.findOne({
      where: { code: promotionCode },
    });

    const newBooking: Booking = this.bookingRepository.create({
      check_in_date,
      check_out_date,
      paymentStatus,
      promotion: promotionCodeFinded ? promotionCodeFinded : null,
    });
    const newEmail: MailDto = {
      to: 'null',
      name: 'null',
      subject: 'Confirmacion de reserva',
      type: MailType.RESERVATION,
      email: '',
    };

    let price: number;
    let numberRoom;
    let allBookings;
    try {
      const exist = await this.roomRepository.existsBy({ id: roomId });
      if (!exist)
        throw new NotFoundException(`The found the room with id: ${roomId}`);
      const roomFinded = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
        relations: {
          bookings: true,
        },
      });

      allBookings = roomFinded.bookings;
      newBooking.room = roomFinded;
      price = !promotionCodeFinded
        ? Number(roomFinded.price)
        : await this.promotionService.useCode(
            promotionCode,
            Number(roomFinded.price),
          );
      numberRoom = roomFinded.roomNumber;
      newEmail.roomNumber = roomFinded.roomNumber.toString();
    } catch (error) {
      if (error.name == 'EntityNotFoundError')
        throw new NotFoundException(`The found the room with id: ${roomId}`);
      console.log(error);
      console.log(error.name);
      throw new InternalServerErrorException(error);
    }

    try {
      const currentInterval = interval(check_in_date, check_out_date);
      console.log('Interval Are Trying to register:', currentInterval);
      allBookings.forEach((booking) => {
        const infoStart = booking.check_in_date
          .split('-')
          .map((e) => Number(e));
        const start = new Date(infoStart[0], infoStart[1] - 1, infoStart[2]);
        const infoEnd = booking.check_out_date.split('-').map((e) => Number(e));
        const end = new Date(infoEnd[0], infoEnd[1] - 1, infoEnd[2]);

        console.log('check_out_date: ', check_out_date);
        console.log('infoEnd: ', infoEnd);
        console.log('end: ', end);
        const newInterval = interval(start, end);
        newEmail.reservationDate = check_in_date.toDateString().split('T')[0];
        console.log('Any Try Interval:', currentInterval);
        if (areIntervalsOverlapping(currentInterval, newInterval))
          throw new BadRequestException('hola');
      });
    } catch (error) {
      throw new NotFoundException(
        'This interval is occuped, plis retry with anothers dates',
      );
    }

    try {
      const userFinded = await this.userRepository.findOneByOrFail({
        id: userId,
      });
      newBooking.user = userFinded;
      newEmail.to = userFinded.email;
      newEmail.name = userFinded.name;
      if (userFinded.membership_status == 'ACTIVE') {
        price = price - price * 0.05;
      }
    } catch (error) {
      if (error.name == 'EntityNotFoundError')
        throw new NotFoundException(`The found the user with id: ${userId}`);
      console.log(error);
      throw new InternalServerErrorException('Conection error DB');
    }

    await this.bookingRepository.save(newBooking);
    await this.mailService.sendMail(newEmail);
    try {
      if (companions) {
        await Promise.all(
          companions.map(async (companion) => {
            const { name, identityCard } = companion;
            const newCompanion = this.companionRepository.create({
              name,
              identityCard,
            });
            newCompanion.booking = newBooking;
            await this.companionRepository.save(newCompanion);
          }),
        );
      }
    } catch (error) {
      if (error.name == 'EntityNotFoundError')
        throw new NotFoundException(`The found the user with id: ${userId}`);
      console.log(error);
      console.log(error.name);
      throw new InternalServerErrorException('Conection error DB');
    }
    console.log(price);
    if (typeof price != 'number') {
      console.log(price);
      console.log(typeof price);
      throw new BadRequestException('Price must be number');
    }
    const infoOrder = {
      id: 1,
      title: numberRoom,
      price,
      orderId: newBooking.id,
    };
    const order = await this.paymentService.createOrder(infoOrder);
    return { newBooking, order };
  }

  async BookingAvailable(check_in_date: Date, check_out_date: Date) {}

  async getAllBookingsById(userId) {
    return await this.bookingRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findBookingsByMonths(rango: number = 1) {
    console.log(rango);

    const nowBogota = new Date();
    nowBogota.setHours(nowBogota.getHours() - 5);
    const firstMonth = new Date(nowBogota.getTime());
    firstMonth.setMonth(firstMonth.getMonth() - rango + 1);
    firstMonth.setDate(1);

    const byLastMonth = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.check_in_date <= :nowBogota', { nowBogota })
      .andWhere('booking.check_out_date >= :firstMonth', { firstMonth })
      .getMany();

    console.log('byLastMonth:', byLastMonth);
    /*     const byLastMonth = await allBookings
      .map(booking => {

        const start = new Date(booking.check_in_date) 
        const end = new Date (booking.check_out_date)

        const now = new Date()
        now.setHours(now.getHours() - 5)
        const toPast = new Date(now.getTime())
        toPast.setMonth(now.getMonth() - rango)
        toPast.setDate(1);

        const  interval1 = interval(start, end)

        const  interval2 = interval(toPast, now)
        console.log("interval1: ", interval1)
        console.log("interval2: ", interval2)
      
        if(areIntervalsOverlapping(interval1, interval2)) return  booking
        
      })
      .filter(booking => booking != null)
 */

    const currentMonth: number = nowBogota.getMonth() + 1;
    let startTime = currentMonth - rango + 1;
    console.log('currentMonth:', currentMonth);
    console.log('startTime:', startTime);

    const allInfoObject = [];
    for (startTime; startTime <= currentMonth; startTime++) {
      const date = new Date(2000, startTime - 1, 1);
      const getMonthName = format(date, 'MMMM');

      const MonthInfo = { mes: '', data: 0 };

      MonthInfo.mes = getMonthName;

      console.log('MonthInfo:', MonthInfo);

      const startIntervalMonth = new Date(nowBogota.getTime());
      startIntervalMonth.setMonth(startTime - 1);
      startIntervalMonth.setDate(1);

      const endIntervalMonth = new Date(nowBogota.getTime());
      endIntervalMonth.setMonth(startTime - 1);
      endIntervalMonth.setDate(1);

      console.log('startIntervalMonth: ', startIntervalMonth);
      console.log('nameMonth: ', getMonthName);

      const intervalMonth = interval(startIntervalMonth, endIntervalMonth);
      byLastMonth.forEach((booking) => {
        const interval1 = interval(
          new Date(booking.check_in_date),
          new Date(booking.check_out_date),
        );

        if (areIntervalsOverlapping(intervalMonth, interval1))
          MonthInfo.data = MonthInfo.data + 1;
      });

      allInfoObject.push(MonthInfo);
    }
    return allInfoObject;
  }

  async findBookingsByMonthsWithTypeRoom(rango: number = 1) {
    const nowBogota = new Date();
    nowBogota.setHours(nowBogota.getHours() - 5);
    const firstMonth = new Date(nowBogota.getTime());
    firstMonth.setMonth(firstMonth.getMonth() - rango + 1);
    firstMonth.setDate(1);

    const globalInterval = interval(firstMonth, nowBogota);

    const byLastMonth = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.check_in_date <= :nowBogota', { nowBogota })
      .andWhere('booking.check_out_date >= :firstMonth', { firstMonth })
      .leftJoinAndSelect('booking.room', 'room')
      .getMany();

    console.log(byLastMonth);

    /*  const byLastMonth = await allBookings
      .map(booking => {

        const start = new Date(booking.check_in_date) 
        const end = new Date (booking.check_out_date)

        const now = new Date()
        now.setHours(now.getHours() - 5)
        const toPast = new Date(now.getTime())
        toPast.setMonth(now.getMonth() - rango)
        toPast.setDate(1);

        const  interval1 = interval(start, end)

        const  interval2 = interval(toPast, now)
      
        if(areIntervalsOverlapping(interval1, interval2)) return  booking
        
      })
      .filter(booking => booking != null)
     */
    const typeRooms = Object.values(TypesRooms);
    console.log('typeRooms:', typeRooms);

    const allInfoObject = [];
    typeRooms.forEach((type) => {
      const allInfoByType = { type, data: 0 };
      const BookingsForType = byLastMonth.filter(
        (booking) => booking.room.type == type,
      );
      allInfoByType.data = BookingsForType.length;

      allInfoObject.push(allInfoByType);
    });

    return allInfoObject;
  }
  async findBookingsByMonthsWithTypeRoomPorcent(rango: number = 1) {
    const nowBogota = new Date();
    nowBogota.setHours(nowBogota.getHours() - 5);
    const firstMonth = new Date(nowBogota.getTime());
    firstMonth.setMonth(firstMonth.getMonth() - rango + 1);
    firstMonth.setDate(1);

    const globalInterval = interval(firstMonth, nowBogota);

    const byLastMonth = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.check_in_date <= :nowBogota', { nowBogota })
      .andWhere('booking.check_out_date >= :firstMonth', { firstMonth })
      .leftJoinAndSelect('booking.room', 'room')
      .getMany();

    console.log(byLastMonth);

    /*  const byLastMonth = await allBookings
      .map(booking => {

        const start = new Date(booking.check_in_date) 
        const end = new Date (booking.check_out_date)

        const now = new Date()
        now.setHours(now.getHours() - 5)
        const toPast = new Date(now.getTime())
        toPast.setMonth(now.getMonth() - rango)
        toPast.setDate(1);

        const  interval1 = interval(start, end)

        const  interval2 = interval(toPast, now)
      
        if(areIntervalsOverlapping(interval1, interval2)) return  booking
        
      })
      .filter(booking => booking != null)
     */
    const typeRooms = Object.values(TypesRooms);
    console.log('typeRooms:', typeRooms);

    const allInfoObject = [];
    typeRooms.forEach((type) => {
      const allInfoByType = { type, data: 0 };
      const BookingsForType = byLastMonth.filter(
        (booking) => booking.room.type == type,
      );
      allInfoByType.data =
        Math.round(
          ((BookingsForType.length * 100) / byLastMonth.length) * 100,
        ) / 100;

      allInfoObject.push(allInfoByType);
    });

    return allInfoObject;
  }

  async cancelBooking(userId, bookingId) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: {
        user: true,
      },
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');
    const threeDaysBefore = subDays(booking.check_in_date, 3);
    const today = new Date().toISOString();
    const canCancel = isBefore(today, threeDaysBefore);
    if (booking.user.id !== userId) {
      throw new MethodNotAllowedException(
        'Tu no puedes modificar esta reserva',
      );
    }

    if (!canCancel)
      throw new BadRequestException(
        'Las reservas solo pueden ser canceladas hasta tres dias antes del check in',
      );

    await this.bookingRepository.update(booking.id, {
      paymentStatus: PaymentStatus.CANCELLED,
    });

    return {
      message: 'reservaicon cancelada',
      status: 200,
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkAndCancelBookings() {
    const twoDaysAgo = subDays(new Date(), 1);

    const bookings = await this.bookingRepository.find({
      where: {
        paymentStatus: PaymentStatus.PENDING,
        createdAt: LessThan(twoDaysAgo),
      },
    });

    bookings.forEach(async (booking) => {
      booking.paymentStatus = PaymentStatus.CANCELLED;
      await this.bookingRepository.save(booking);
    });
  }
}
