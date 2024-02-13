import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TiendaService } from '../services/tienda.service';
import { TIPO_DATOS_REQ_KEY, TIPO_DATO_REQ } from 'src/common/constants';
import { Request } from 'express';

@Injectable()
export class SuspendedGuard implements CanActivate {

  constructor(
    private readonly tiendaService: TiendaService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const tipoDatoReq = this.reflector.get<Array<keyof typeof TIPO_DATO_REQ>>(TIPO_DATOS_REQ_KEY, context.getHandler(),);

      console.log('tipoDatoReq', tipoDatoReq);

      if (tipoDatoReq === undefined) return true;

      if (tipoDatoReq.includes('PARAMS')) {
        const id = request.params.id || request.params.tiendaId;
        if (!id) throw new BadRequestException('No se ha enviado el id de la tienda');
        const tienda = await this.tiendaService.findOne(id);
        if (tienda.estaSuspendido) throw new UnauthorizedException('Tienda suspendida');
      }

      if (tipoDatoReq.includes('BODY')) {
        const tiendaId = request.body.tienda;
        if (!tiendaId) throw new BadRequestException('No se ha enviado el id de la tienda');
        const tienda = await this.tiendaService.findOne(tiendaId);
        if (tienda.estaSuspendido) throw new UnauthorizedException('Tienda suspendida');
      }

      if (tipoDatoReq.includes('QUERY')) {
        const id = request.query.id || request.query.tiendaId;
        if (!id) throw new BadRequestException('No se ha enviado el id de la tienda');
        const tienda = await this.tiendaService.findOne(id as string);
        if (tienda.estaSuspendido) throw new UnauthorizedException('Tienda suspendida');
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
