import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { UserService } from 'src/users/services/users.service';
import { ClientService } from 'src/users/services/client.service';
import { userToken } from '../utils/user-token.utils';
import { clientToken } from '../utils/client-token.utils';
import { IUserToken } from '../interfaces/userToken.interface';
import { IClientToken } from '../interfaces/client-token.interface';
/* Verifica si el token es valido y si el usuario o cliente existe en la base de datos */
@Injectable()
export class UniversalAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization?.split(' ')[1];

      if (!token || Array.isArray(token)) {
        throw new UnauthorizedException('Token no encontrado');
      }

      
      const decoded = jwt.decode(token) as any;
      if (!decoded?.type) throw new UnauthorizedException('Token sin tipo definido');

      if (decoded.type === 'user') {
        const decodedUser: IUserToken | string = userToken(token);
        if (typeof decodedUser === 'string') throw new UnauthorizedException(decodedUser);
        if (decodedUser.isExpired) throw new UnauthorizedException('Token expirado');
        const user = await this.userService.findOneAuth(decodedUser.sub);
        request.userId = user.id;
        request.roleId = user.role.id;
        return true;
      }

      if (decoded.type === 'client') {
        const decodedClient: IClientToken | string = clientToken(token);
        if (typeof decodedClient === 'string') throw new UnauthorizedException(decodedClient);
        if (decodedClient.isExpired) throw new UnauthorizedException('Token expirado');
        const client = await this.clientService.findOneAuth(decodedClient.sub);
        request.clientId = client.id;
        return true;
      }

      throw new UnauthorizedException('Tipo de token desconocido');
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error al validar el token');
    }
  }
}
