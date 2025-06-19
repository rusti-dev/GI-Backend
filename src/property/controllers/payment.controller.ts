import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface CreatePaymentIntentDto {
  amount: number;
}

interface ConfirmPaymentDto {
  paymentIntentId: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly contractService: ContractService) {}

  @Post('create-intent/:contractId')
  @ApiOperation({ summary: 'Crear intención de pago para un contrato' })
  @ApiResponse({ status: 201, description: 'Intención de pago creada exitosamente' })
  async createPaymentIntent(
    @Param('contractId') contractId: string,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    try {
      const result = await this.contractService.createPaymentIntent(
        contractId,
        createPaymentIntentDto.amount
      );

      return {
        statusCode: 201,
        data: result,
        message: 'Intención de pago creada exitosamente'
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar pago' })
  @ApiResponse({ status: 200, description: 'Pago confirmado exitosamente' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const isConfirmed = await this.contractService.confirmPayment(
        confirmPaymentDto.paymentIntentId
      );

      return {
        statusCode: 200,
        data: { confirmed: isConfirmed },
        message: isConfirmed ? 'Pago confirmado exitosamente' : 'El pago no pudo ser confirmado'
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('stripe-public-key')
  @ApiOperation({ summary: 'Obtener clave pública de Stripe' })
  async getStripePublicKey() {
    return {
      statusCode: 200,
      data: {
        publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_...'
      }
    };
  }
} 