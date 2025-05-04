import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { ClientService } from 'src/users/services/client.service';
import { ClientEntity } from 'src/users/entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';

import { handlerError } from 'src/common/utils/handlerError.utils';
import { IGenerateToken } from '../interfaces/generate-token.interface';
import { IClientToken } from '../interfaces/client-token.interface';
import { clientToken } from 'src/users/utils/client-token.utils';

@Injectable()
export class CustomerAuthService {
  private readonly logger = new Logger('CustomerAuthService');

  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
    private readonly dataSources: DataSource,
  ) {}

  public async customerLogin(email: string, password: string): Promise<any> {
    try {
      const client = await this.clientService.findByEmail(email);
      if (!client) throw new NotFoundException('Cliente o contraseña incorrectos');

      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid || !client.isActive)
        throw new UnauthorizedException('Cliente o contraseña incorrectos');

      return this.generateJWT(client);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async customerRegister(registerDto: CreateClientDto): Promise<any> {
    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingClient = await this.clientService.findByEmail(registerDto.email);
      if (existingClient) throw new BadRequestException('Email ya registrado');

      const newClient = await this.clientService.create(registerDto);

      await queryRunner.manager.save(newClient);
      await queryRunner.commitTransaction();

      return this.generateJWT(newClient);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handlerError(error, this.logger);
    } finally {
      await queryRunner.release();
    }
  }

  public async checkCustomerToken(token: string): Promise<ClientEntity> {
    try {
      const decoded: IClientToken | string = clientToken(token);
      if (typeof decoded === 'string') throw new UnauthorizedException(decoded);
      if (decoded.isExpired) throw new UnauthorizedException('Token expirado');

      return await this.clientService.findOneAuth(decoded.sub);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  private async generateJWT(client: ClientEntity): Promise<any> {
    const clientLogged = await this.clientService.findOneAuth(client.id);

    const payload = {
      sub: clientLogged.id,
      email: clientLogged.email,
      type: 'client',
    };

    const accessToken = this.signJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'),
      expiresIn: 28800, // 8 horas
    });

    return {
      accessToken,
      Client: {
        id: clientLogged.id,
        name: clientLogged.name,
        email: clientLogged.email,
        phone: clientLogged.phone,
      },
    };
  }

  private signJWT({ payload, secret, expiresIn }: IGenerateToken): string {
    const options: jwt.SignOptions = { expiresIn: expiresIn as any }; 
    return jwt.sign(payload, secret, options);
  }
}
