import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import {
  PERMISSION,
  PERMISSION_KEY,
} from '../../users/constants/permission.constant';
import { PermissionRoleService } from '../services/permission-role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionRoleService: PermissionRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Obtiene los permisos requeridos para acceder a la ruta
      const permissionRequire = this.reflector.get<Array<PERMISSION>>(
        PERMISSION_KEY,
        context.getHandler(),
      );
      // Obtiene el rol del usuario
      const request = context.switchToHttp().getRequest<Request>();
      // Si no se requiere permisos para acceder a la ruta, se permite el acceso
      if (permissionRequire === undefined || permissionRequire.length == 0)
        return true;

      const { roleId } = request;
      // Obtiene los permisos del rol del usuario
      const permissionsUser =
        await this.permissionRoleService.getPermissionsByRole(roleId);
      // Obtiene solo los nombres de los permisos
      const permissionArrayName = permissionsUser.map(
        (permission) => permission.permission.name,
      );

      let isAuthorized = false;
      // Verifica si el usuario tiene permisos para acceder a la ruta
      permissionArrayName.forEach((permission) => {
        if (permissionRequire.includes(permission as PERMISSION))
          return (isAuthorized = true);
      });
      // Si el usuario no tiene permisos para acceder a la ruta, se lanza una excepción
      if (!isAuthorized)
        throw new UnauthorizedException(
          'No tienes permisos para acceder a esta ruta.',
        );

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error al validar los permisos');
    }
  }
}
