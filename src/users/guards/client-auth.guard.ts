import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientService } from '../services/client.service';
import { clientToken } from '../utils/client-token.utils';
import { IClientToken } from '../interfaces/client-token.interface';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly clientService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const decoded: IClientToken | string = clientToken(token);
    if (typeof decoded === 'string') throw new UnauthorizedException(decoded);
    if (decoded.isExpired) throw new UnauthorizedException('Token expirado');

    const client = await this.clientService.findOneAuth(decoded.sub);
    request.clientId = client.id;
    return true;
  }
}
