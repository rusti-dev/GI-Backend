import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, NotFoundException, UnauthorizedException, } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UsersEntity } from '../../users/entities/users.entity';
import { UserService } from '../../users/services/users.service';
import { IPayload } from '../interfaces/payload.interface';
import { IUserToken } from '../interfaces/userToken.interface';
import { CreateUserDto, UpdateUserDto } from '../../users/dto';
import { HttpCustomService } from 'src/providers/http/http.service';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { userToken } from 'src/common/utils/user.token';
import { ROLES } from 'src/common/constants';
// import { SendMailOptions } from 'src/providers/email/interfaces';
import { checkTokenGoogleUrl } from 'src/common/constants/configuracion';
import { EmailService } from 'src/providers/email/email.service';

interface IJwtPayload {
  payload: jwt.JwtPayload; secret: string; expiresIn: number | string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpCustomService,
    private readonly emailService: EmailService
  ) { }

  public async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneBy({ key: 'email', value: email });
      if (user.esta_suspendido)
        throw new NotFoundException('Cuenta suspendida, contactate con nosotros ' + this.configService.get('APP_URL'))

      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new NotFoundException('Usuario o contraseña incorrectos');

      return this.generateJWT(user);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async checkToken(token: string) {
    try {
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string') throw new BadRequestException('Token invalido');
      if (managerToken.isExpired) throw new BadRequestException('Token expirado');
      const user = await this.userService.findOneAuth(managerToken.sub);
      return user;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async register(createUserDto: CreateUserDto): Promise<UsersEntity> {
    return await this.userService.createUser(createUserDto);
  }

  public singJWT({ payload, secret, expiresIn }: IJwtPayload) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  public async generateJWT(user: UsersEntity): Promise<any> {
    const getUser: UsersEntity = await this.userService.findOne(user.id);
    const payload: IPayload = { sub: getUser.id, role: getUser.role };
    const accessToken = this.singJWT({
      payload, secret: this.configService.get('JWT_AUTH'), expiresIn: '1d'
    });
    return { accessToken, User: getUser };
  }

  public async recoverPassword(email: string): Promise<any> {
    const user = await this.userService.findOneBy({ key: 'email', value: email });
    const payload: IPayload = { sub: user.id, role: user.role };

    const accessToken = this.singJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'),
      expiresIn: '1h',
    });

    return { accessToken };
  }

  // public async sendMailResetPassword(email: string, accessToken: string): Promise<boolean> {
  //   const resetLink = `${this.configService.get('APP_URL')}/auth/reset-password?token=${accessToken}`;
  //   const subject = 'Recuperación de contraseña';
  //   const html = `
  //       <html>
  //       <head>
  //           <style>
  //               .container {
  //                   font-family: Arial, sans-serif;
  //                   background-color: #f4f4f4;
  //                   padding: 20px;
  //                   border-radius: 5px;
  //               }
  //               .btn {
  //                   background-color: #007bff;
  //                   color: white;
  //                   padding: 10px 20px;
  //                   text-decoration: none;
  //                   border-radius: 5px;
  //               }
  //           </style>
  //       </head>
  //       <body>
  //           <div class="container">
  //               <h2>Recuperación de contraseña</h2>
  //               <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
  //               <a href="${resetLink}" class="btn" style="color: white; text-decoration: none;">Restablecer contraseña</a>
  //           </div>
  //       </body>
  //       </html>
  //   `;
  //   const options: SendMailOptions = {
  //     to: email,
  //     subject: subject,
  //     html: html
  //   };
  //   return await this.emailService.sendEmail(options);
  // }

  public async resetPassword(email: string, password: string): Promise<any> {
    const { id } = await this.userService.findOneBy({ key: 'email', value: email, });
    const updateUserDto: UpdateUserDto = {
      password: password
    };
    return this.userService.update(id, updateUserDto);
  }

  public async checkTokenGoogle(accessToken: string): Promise<any> {
    try {
      const url = `${checkTokenGoogleUrl}${accessToken}`;
      const response = await this.httpService.apiCheckTokenGoogle(url);
      return response;
    } catch (error) {
      throw new UnauthorizedException(`Error al verificar el accessToken`);
    }
  }

  public async loginWithGoogle(accessToken: string): Promise<any> {
    try {
      const googleUserData = await this.checkTokenGoogle(accessToken);
      let user;
      try {
        user = await this.userService.findOneBy({ key: 'email', value: googleUserData.email });
      } catch (error) {
        if (error instanceof NotFoundException) {
          const createUserDto: CreateUserDto = {
            nombre: googleUserData.given_name,
            apellido: googleUserData.family_name,
            email: googleUserData.email,
            password: '',
            role: ROLES.BASIC,
            genero: null,
            config_notificacion: [],
            token_app: '',
          };
          user = await this.userService.createUser(createUserDto);
        } else {
          throw error;
        }
      }
      if (user.esta_suspendido) throw new NotFoundException('Cuenta suspendida, contactate con nosotros')
      return this.generateJWT(user);
    } catch (error) {
      throw new UnauthorizedException(`Error al iniciar sesión con Google: ${error.message}`);
    }
  }
}
