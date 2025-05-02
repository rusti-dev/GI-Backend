import { AuthDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { CustomerAuthService } from '../services/customer-auth.service';
import { RegisterUserDto } from '../dto/create-user.dto';
import { ResponseMessage } from '../../common/interfaces';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Body, Controller, Get, Post, Query, Req, UseGuards  } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiBearerAuth  } from '@nestjs/swagger/dist/decorators';
import { AuthCustomerDto } from '../dto/auth-customer.dto';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerAuthService: CustomerAuthService,
  ) { }

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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  public async logout(@Req() request: Request): Promise<ResponseMessage> {
    // No es necesario invalidar el token en el backend si usamos JWT,
    // pero podríamos implementar una blacklist de tokens si fuera necesario
    return {
      statusCode: 200,
      message: 'Sesión cerrada correctamente'
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

  @ApiQuery({ name: 'token', type: 'string', required: true })
  @Get('customer/checkToken')
  public async checkCustomerToken(@Query('token') token: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.customerAuthService.checkCustomerToken(token),
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
