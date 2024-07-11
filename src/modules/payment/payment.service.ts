import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
dotenvConfig({ path: '.env.development' });
import { Payment as Pay } from 'src/entity/Payment.entity';
import { Repository } from 'typeorm';
import { Booking } from 'src/entity/Booking.entity';
import * as dotenv from 'dotenv';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Room } from 'src/entity/Room.entity';
//import { MailService } from '../mail/mail.service';

dotenv.config();

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Pay) private paymentReposotory: Repository<Pay>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    //@InjectRepository(MailService) private mailService: MailService,
  ) {}

  async createOrder(newOrderData) {
    //const webhook = process.env.MERCADO_PAGO_WEBHOOK;
    const { title, price, orderId } = newOrderData;
    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_TOKEN,
      });
      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [
            {
              id: null,
              title: `Reservación para la habitacion ${title}`,
              quantity: 1,
              unit_price: price,
              currency_id: 'COP',
            },
          ],
          payment_methods: {
            installments: 1,
          },
          back_urls: {
            success: 'https://front-pfg-6.vercel.app/',
          },
          notification_url: `https://597f-187-232-121-22.ngrok-free.app/payment/webhook`,
          external_reference: orderId,
        },
      });
      console.log(result);
      const response = {
        id: result.id,
        init_point: result.init_point,
      };
      return response;
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
    }
  }

  async webHook(id) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_TOKEN,
      });
      const payment = new Payment(client);
      const pay = await payment.get({ id: id });
      const orderId = pay.external_reference;
      const order = await this.bookingRepository.findOne({
        where: { id: orderId },
      });
      if (order) {
        const newPayment: Partial<Pay> = {
          mercadoPagoId: pay.id,
          total: pay.net_amount,
          paymentDate: new Date(pay.date_approved),
          paymentMethod: pay.payment_type_id,
          paymentState: pay.status,
          booking: order,
        };
        await this.paymentReposotory.save(newPayment);
        order.paymentStatus = pay.status;
        await this.bookingRepository.save(order);

        //await this.mailService.sendMail()
      } else {
        throw new NotFoundException('orden no encontrada');
      }
      return { succes: true };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllRoomTypes() {
    return await this.roomRepository
      .createQueryBuilder('room')
      .select('DISTINCT room.type', 'type')
      .getRawMany();
  }

  async timeBasedRevenue(months) {
    const revenueData = [];
    for (let index = 0; index < months; index++) {
      const date = new Date();
      const monthDate = subMonths(date, months - index - 1);
      const startDate = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(monthDate), 'yyyy-MM-dd');
      const monthName = format(monthDate, 'MMM', { locale: es });
      const data = await this.paymentReposotory
        .createQueryBuilder('pay')
        .select('SUM(pay.total)', 'total')
        .where(
          `pay.paymentDate >= :startDate AND pay.paymentDate <= :endDate`,
          { startDate, endDate },
        )
        .getRawOne();

      const total = parseFloat(data.total) || 0;
      revenueData.push({ mes: monthName, data: total });
    }
    return revenueData;
  }

  async roomBasedRevenue(months) {
    const revenueData = [];
    const currentDate = new Date();
    const startDate = format(
      startOfMonth(subMonths(currentDate, months - 1)),
      'yyyy-MM-dd',
    );
    const types = await this.getAllRoomTypes();

    const revenueMap = new Map(types.map((type) => [type.type, 0]));

    const data = await this.paymentReposotory
      .createQueryBuilder('pay')
      .select('room.type', 'tipo')
      .addSelect('SUM(pay.total)', 'total')
      .leftJoin('pay.booking', 'booking')
      .leftJoin('booking.room', 'room')
      .where('pay.paymentDate >= :startDate', { startDate })
      .groupBy('room.type')
      .getRawMany();

    data.forEach((record) => {
      revenueMap.set(record.tipo, parseFloat(record.total));
    });
    revenueMap.forEach((value, key) => {
      revenueData.push({
        tipo: key,
        data: value,
      });
    });

    return revenueData;
  }

  async roomBasedRevenuePercent(months) {
    const revenueData = await this.timeBasedRevenue(months);
    const totalData = revenueData.reduce((acc, curr) => acc + curr.data, 0);
    const revenuePercentData = [];
    const currentDate = new Date();
    const startDate = format(
      startOfMonth(subMonths(currentDate, months - 1)),
      'yyyy-MM-dd',
    );
    const types = await this.getAllRoomTypes();

    const revenueMap = new Map(types.map((type) => [type.type, 0]));

    const data = await this.paymentReposotory
      .createQueryBuilder('pay')
      .select('room.type', 'tipo')
      .addSelect('SUM(pay.total)', 'total')
      .leftJoin('pay.booking', 'booking')
      .leftJoin('booking.room', 'room')
      .where('pay.paymentDate >= :startDate', { startDate })
      .groupBy('room.type')
      .getRawMany();

    data.forEach((record) => {
      revenueMap.set(record.tipo, parseFloat(record.total));
    });
    revenueMap.forEach((value, key) => {
      revenuePercentData.push({
        tipo: key,
        data: (value / totalData) * 100 || 0,
      });
    });

    return revenuePercentData;
  }

  async timeAndRoomBasedRevenue(months) {
    const revenueData = [];
    const typesData = await this.getAllRoomTypes();
    const types = typesData.map((type) => type.type);
    for (let index = 0; index < months; index++) {
      const date = new Date();
      const monthDate = subMonths(date, months - index - 1);
      const startDate = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(monthDate), 'yyyy-MM-dd');
      const monthName = format(monthDate, 'MMM', { locale: es });

      const data = await this.paymentReposotory
        .createQueryBuilder('pay')
        .select('room.type', 'tipo')
        .addSelect('SUM(pay.total)', 'total')
        .leftJoin('pay.booking', 'booking')
        .leftJoin('booking.room', 'room')
        .where(
          'room.type IN (:...types) AND pay.paymentDate >= :startDate AND pay.paymentDate <= :endDate',
          { types, startDate, endDate },
        )
        .groupBy('room.type')
        .getRawMany();

      const typesMap = new Map(
        types.map((type) => [type, { tipo: type, data: 0 }]),
      );
      data.forEach((record) => {
        typesMap.set(record.tipo, {
          tipo: record.tipo,
          data: parseFloat(record.total) || 0,
        });
      });

      revenueData.push({ [monthName]: Array.from(typesMap.values()) });
    }

    return revenueData;
  }
}
