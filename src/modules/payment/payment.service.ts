import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
dotenvConfig({ path: '.env.development' });
import { Payment as Pay } from 'src/entity/Payment.entity';
import { Repository } from 'typeorm';
import { Booking } from 'src/entity/Booking.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Pay) private paymentReposotory: Repository<Pay>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}

  async createOrder(newOrderData) {
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
              title: title,
              quantity: 1,
              unit_price: price,
              currency_id: 'COP',
            },
          ],
          payment_methods: {
            //default_payment_method_id: 'master',
            installments: 1,
          },
          notification_url:
            'https://dd98-2806-103e-16-8bba-b495-b48e-b1c-13ef.ngrok-free.app/payment/webhook',
          external_reference: orderId,
        },
      });
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
      } else {
        throw new NotFoundException('orden no encontrada');
      }
      return { succes: true };
    } catch (error) {
      console.log(error);
    }
  }
}