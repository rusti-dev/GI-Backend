import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ClientService } from 'src/users/services/client.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { IGenerateToken } from '../interfaces/generate-token.interface';
import { ClientEntity } from 'src/users/entities/client.entity';
import { userToken } from '../utils/user-token.utils';
import { IUserToken } from '../interfaces/userToken.interface';

@Injectable()
export class CustomerAuthService {
  private readonly logger = new Logger('CustomerAuthService');

  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
    private readonly dataSources: DataSource,
  ) { }

  public async customerLogin(email: string, password: string): Promise<any> {
    try {
      const client = await this.clientService.findByEmail(email);
      if (!client) throw new NotFoundException('Cliente o contraseña incorrectos1');

      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid) throw new NotFoundException('Cliente o contraseña incorrectos2');

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
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string') throw new NotFoundException('Token inválido');
      if (managerToken.isExpired) throw new NotFoundException('Token expirado');

      const client = await this.clientService.findOne(managerToken.sub);
      return client;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }


  private async generateJWT(client: ClientEntity): Promise<any> {
    const clientLogged: ClientEntity = await this.clientService.findOne(client.id);

    const payload = {
      sub: clientLogged.id,
      email: clientLogged.email,
    };

    const accessToken = this.signJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'), // o puedes crear otro secreto JWT_CUSTOMER si quieres separar
      expiresIn: 28800,
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

  private signJWT({ payload, secret, expiresIn }: IGenerateToken) {
    const options: jwt.SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, secret, options);
  }
}
