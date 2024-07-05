import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MercadoPagoConfig,
  Preference,
  Payment,
  PreApproval,
  PreApprovalPlan,
  CardToken,
  Customer,
  CustomerCard,
} from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
dotenvConfig({ path: '.env.development' });
import { Payment as Pay } from 'src/entity/Payment.entity';
import { Repository } from 'typeorm';
import { Booking } from 'src/entity/Booking.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Pay) private paymentReposotory: Repository<Pay>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}

  async createOrder(newOrderData) {
    const webhook = process.env.MERCADO_PAGO_WEBHOOK;
    console.log(webhook);
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
            success: 'https://aqua-maris-hotel.vercel.app/',
          },
          notification_url: `${webhook}/payment/webhook`,
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

  async createPreApprobalPlan(cardFormData) {
    try {
      console.log(cardFormData);
      const client = new MercadoPagoConfig({
        accessToken:
          'APP_USR-6809484250029114-070323-4ca5da7b5d7eaeabbbc11ebccf069776-1883578160',
      });
      const preApprovalPlan = new PreApprovalPlan(client);

      const newPreApprobalPlan = await preApprovalPlan.create({
        body: {
          reason: 'premium suscription',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 20000,
            currency_id: 'COP',
            billing_day: 3,
          },
          back_url:
            'https://dd98-2806-103e-16-8bba-b495-b48e-b1c-13ef.ngrok-free.app/payment/subswebhook',
        },
      });
      console.log(newPreApprobalPlan);
      const subscripcion = await this.createPreApprobal(
        newPreApprobalPlan.id,
        cardFormData.token,
        cardFormData.payer.email,
      );
      return subscripcion;
    } catch (error) {
      console.log(error);
    }
  }

  async createPreApprobal(id, cardTokenId, email) {
    try {
      console.log(cardTokenId + 'console log de cardid');
      const client = new MercadoPagoConfig({
        accessToken:
          'APP_USR-6809484250029114-070323-4ca5da7b5d7eaeabbbc11ebccf069776-1883578160',
      });

      const preApprobal = new PreApproval(client);

      const newPreApprobal = await preApprobal.create({
        body: {
          reason: 'premium suscription',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 20000,
            currency_id: 'COP',
          },
          back_url:
            'https://dd98-2806-103e-16-8bba-b495-b48e-b1c-13ef.ngrok-free.app/payment/subswebhook',
          status: 'authorized',
          payer_email: email,
          preapproval_plan_id: id,
          card_token_id: `${cardTokenId}`,
        },
      });
      console.log(newPreApprobal);

      return newPreApprobal;
    } catch (error) {
      console.log(error);
    }
  }
}
