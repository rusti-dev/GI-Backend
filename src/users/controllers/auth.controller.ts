import { AuthDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { CustomerAuthService } from '../services/customer-auth.service';
import { RegisterUserDto } from '../dto/create-user.dto';
import { ResponseMessage } from '../../common/interfaces';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthCustomerDto } from '../dto/auth-customer.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerAuthService: CustomerAuthService, 
  ) {}

  @Post('login')
  public async login(@Body() authDto: AuthDTO): Promise<ResponseMessage> {
    const { email, password } = authDto;
    return {
      statusCode: 200,
      data: await this.authService.login(email, password),
    };
  }

  @ApiQuery({ name: 'token', type: 'string', required: true })
  @Get('checkToken')
  public async checkToken(@Query('token') token: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.authService.checkToken(token),
    };
  }

  @Post('google/login')
  public async googleLogin(@Body('token') token: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.authService.googleLogin(token),
    };
  }

  @Post('customer/login')
  public async customerLogin(@Body() authDto: AuthCustomerDto): Promise<ResponseMessage> {
    const { email, password } = authDto;
    return {
      statusCode: 200,
      data: await this.customerAuthService.customerLogin(email, password),
    };
  }

  @Post('customer/register')
  public async customerRegister(@Body() dto: CreateCustomerDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.customerAuthService.customerRegister(dto),
    };
  }

  @Post('register')
  public async register(@Body() register: RegisterUserDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.authService.register(register),
    };
  }

  // Futuro: forgot-password, reset-password
}
