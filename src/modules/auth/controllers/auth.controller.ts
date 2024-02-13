import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';

// import { AuthDTO, ResetPasswordDTO, SendEmailDTO, AuthGoogleDTO } from '../dto/index';
import { AuthDTO, ResetPasswordDTO } from '../dto/index';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dto';
import { ResponseMessage } from 'src/common/interfaces/responseMessage.interface';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.authService.register(createUserDto),
    };
  }

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

  // @Post('login-google')
  // public async loginWithGoogle(@Body() authGoogleDTO: AuthGoogleDTO): Promise<ResponseMessage> {
  //   const { access_token } = authGoogleDTO;
  //   return {
  //     statusCode: 200,
  //     data: await this.authService.loginWithGoogle(access_token)
  //   };
  // }

  // @Post('forgot-password')
  // public async requestPasswordForgot(@Body() sendEamilDTO: SendEmailDTO): Promise<ResponseMessage> {
  //   const { email } = sendEamilDTO;
  //   const response = await this.authService.recoverPassword(email);
  //   return {
  //     statusCode: 200,
  //     data: await this.authService.sendMailResetPassword(email, response.accessToken)
  //   }
  // }

  @ApiParam({ name: 'token', type: 'string', required: true })
  @Get('checkToken-password/:token')
  public async requestPasswordCheckToken(@Param() param): Promise<ResponseMessage> {
    const response = await this.authService.checkToken(param.token);
    return {
      statusCode: 200,
      data: response
    };
  }

  @Post('reset-password')
  public async requestPasswordReset(@Body() resetpasswordDto: ResetPasswordDTO): Promise<ResponseMessage> {
    const { token, password } = resetpasswordDto;
    const { email } = await this.authService.checkToken(token);
    return {
      statusCode: 200,
      data: await this.authService.resetPassword(email, password)
    };
  }

}
