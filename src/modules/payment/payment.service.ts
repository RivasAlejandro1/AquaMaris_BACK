import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
dotenvConfig({ path: '.env.development' });
import { Payment as Pay } from 'src/entity/Payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Pay) private paymentReposotory: Repository<Pay>,
  ) {}

  async createOrder(newOrderData) {
    const { id, title, price, orderId } = newOrderData;
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
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_TOKEN,
    });
    const payment = new Payment(client);
    const pay = await payment.get({ id: id });
    const newPayment: Partial<Pay> = {
      mercadoPagoId: pay.id,
      total: pay.net_amount,
      paymentDate: new Date(pay.date_approved),
      paymentMethod: pay.payment_type_id,
      paymentState: pay.status,
      //booking: pay.external_reference,
    };
    await this.paymentReposotory.save(newPayment);
    return { succes: true };
  }
}
