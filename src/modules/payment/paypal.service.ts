import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { User } from '../../entity/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';

dotenv.config();

@Injectable()
export class PayPalService {
  private readonly clientId = process.env.PAYPAL_CLIENT;
  private readonly clientSecret = process.env.PAYPAL_SECRET;
  private readonly apiUrl = process.env.PAYPAL_API;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );
    const response = await axios.post(
      `${this.apiUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }

  public async createProduct(userId) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const accessToken = await this.getAccessToken();
    const product = {
      name: 'AquaMaris Premium',
      description: 'Suscripcion premium en hoteles AquaMaris',
      type: 'SERVICE',
      category: 'TRAVEL',
    };

    const response = await axios.post(
      `${this.apiUrl}/v1/catalogs/products`,
      product,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Prefer: 'return=representation',
        },
      },
    );

    const plan = await this.createPlan(response.data.id, accessToken, user);
    return plan;
  }

  public async createPlan(productId, accessToken, user) {
    const plan = {
      product_id: productId,
      name: 'AquaMaris Premium',
      description: 'Suscripcion premium en hoteles AquaMaris',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 12,
          pricing_scheme: {
            fixed_price: {
              value: '100.00',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: '10',
        inclusive: false,
      },
      custom_id: user.id,
    };
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/billing/plans`,
        plan,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

      const subscription = await this.createSubscription(
        response.data.id,
        accessToken,
        user,
      );
      return subscription;
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  public async createSubscription(planId: string, accessToken, user) {
    //const startTime = new Date(Date.now() + 60000).toISOString();
    //startTime.setMinutes(startTime.getMinutes() + 5);
    const subscription = {
      plan_id: planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Adjust start time as needed
      quantity: '1',
      auto_renewal: true,
      shipping_amount: {
        currency_code: 'USD',
        value: '0.00',
      },
      subscriber: {
        name: {
          given_name: user.name,
        },
        email_address: user.email,
      },
      application_context: {
        brand_name: 'AquaMaris',
        locale: 'en-US',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: 'https://front-pfg-6.vercel.app/',
        cancel_url: 'https://example.com/cancelUrl',
      },
      custom_id: user.id,
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/billing/subscriptions`,
        subscription,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error creating subscription:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  public async suscriptionWebHook(request) {
    const userId = request.resource.custom_id;
    const status = request.resource.status;
    const suscription_id = request.resource.id;
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      await this.userRepository.update(
        { id: user.id },
        {
          suscription_id: suscription_id,
          membership_status: MembershipStatus.ACTIVE,
        },
      );
      return 'OK';
    } catch (error) {
      console.log(error);
    }
  }

  public async cancelSubscriptionWebHook(request) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: request.resource.custom_id },
      });
      await this.userRepository.update(
        { id: user.id },
        {
          membership_status: MembershipStatus.CANCELLED,
          suscription_id: '',
        },
      );
      return 'OK';
    } catch (error) {
      console.log(error);
    }
  }

  public async cancelSubscription(userId) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.membership_status != MembershipStatus.ACTIVE)
      throw new BadRequestException(
        'Este usuario no tiene activa la membresia',
      );
    const accessToken = await this.getAccessToken();
    const suscription = user.suscription_id;
    const cancel = {
      reason: 'Not satisfied with the service',
    };
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/billing/subscriptions/${suscription}/cancel`,
        cancel,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error cancelating subscription:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  public async suscriptionPenddingWebHook(request) {
    const userId = request.resource.custom_id;
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      await this.userRepository.update(
        { id: user.id },
        {
          membership_status: MembershipStatus.PENDING,
        },
      );
      return 'OK';
    } catch (error) {
      console.log(error);
    }
  }
}
