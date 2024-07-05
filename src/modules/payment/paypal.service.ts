import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { User } from '../../entity/User.entity';

dotenv.config();

@Injectable()
export class PayPalService {
  private readonly clientId = process.env.PAYPAL_CLIENT;
  private readonly clientSecret = process.env.PAYPAL_SECRET;
  private readonly apiUrl = process.env.PAYPAL_API;

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

  public async createProduct() {
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
    console.log(response.data);
    console.log(response.data.id);
    const plan = await this.createPlan(response.data.id, accessToken);
    return plan;
  }

  public async createPlan(productId, accessToken) {
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
              value: '100',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 3,
      },
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
      );
      return subscription;
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  public async createSubscription(planId: string, accessToken) {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 10);
    const subscription = {
      plan_id: planId,
      start_time: startTime.toISOString(), // Adjust start time as needed
      quantity: '1',
      auto_renewal: true,
      shipping_amount: {
        currency_code: 'USD',
        value: '100.00',
      },
      subscriber: {
        name: {
          given_name: 'Joshua',
        },
        email_address: 'ejemplo@ejemplo.com',
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
        return_url: 'https://aqua-maris-hotel.vercel.app/',
        cancel_url: 'https://example.com/cancelUrl',
      },
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
}
