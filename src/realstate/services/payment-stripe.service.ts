import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PAYMENTMETHOD } from '../entities/payment_method.entity';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
  paymentMethod: PAYMENTMETHOD;
  clientEmail?: string;
  clientName?: string;
  contractNumber: string;
}

interface StripePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
}

@Injectable()
export class PaymentStripeService {
  private readonly logger = new Logger('PaymentStripeService');
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
      apiVersion: '2025-05-28.basil'
    });
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<StripePaymentResponse> {
    try {
      let paymentMethodTypes: string[] = [];

      switch (request.paymentMethod) {
        case PAYMENTMETHOD.credit_card:
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.cash:
          // Para efectivo, usamos card como simulación
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.qr_code:
          // Para QR, usamos card como simulación (en producción puedes agregar 'us_bank_account' o 'link')
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.crypto:
          // Para crypto, usamos card como simulación
          paymentMethodTypes = ['card'];
          break;
        default:
          paymentMethodTypes = ['card'];
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100), // Stripe usa centavos
        currency: request.currency.toLowerCase(),
        payment_method_types: paymentMethodTypes,
        metadata: {
          contractNumber: request.contractNumber,
          paymentMethod: request.paymentMethod,
          clientEmail: request.clientEmail || '',
          clientName: request.clientName || ''
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new Error(`Error al crear la intención de pago: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      return false;
    }
  }

  async createSimulatedPaymentForCash(amount: number, contractNumber: string): Promise<StripePaymentResponse> {
    // Para efectivo, creamos un pago simulado que se confirma automáticamente
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          contractNumber,
          paymentMethod: PAYMENTMETHOD.cash,
          simulated: 'true'
        },
        confirm: true,
        payment_method: await this.createTestPaymentMethod(),
        return_url: 'https://your-website.com/return'
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      this.logger.error('Error creating simulated cash payment:', error);
      throw new Error(`Error al procesar pago en efectivo: ${error.message}`);
    }
  }

  private async createTestPaymentMethod(): Promise<string> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123',
      },
    });

    return paymentMethod.id;
  }

  async getPaymentDetails(paymentIntentId: string): Promise<any> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Error retrieving payment details:', error);
      throw new Error(`Error al obtener detalles del pago: ${error.message}`);
    }
  }
} 