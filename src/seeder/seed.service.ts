import { Injectable, Logger } from '@nestjs/common';

import { handlerError } from '../common/utils/handlerError.utils';
import { ROLES } from '../common/constants';
import { GENEROS } from '../common/constants/configuracion';
import { UserService } from 'src/modules/users/services/users.service';
import { TiendaService } from 'src/modules/tienda/services/tienda.service';
import { CreateUserDto } from 'src/modules/users/dto';
import { CreateTiendaDto } from 'src/modules/tienda/dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeederService');

  constructor(
    private readonly userService: UserService,
    private readonly tiendaService: TiendaService,
  ) { }

  public async runSeeders() {
    if (process.env.APP_PROD == true)
      return { message: 'No se puede ejecutar seeders en producción' };
    try {
      const user: CreateUserDto = {
        nombre: 'luis',
        apellido: 'janco',
        email: 'luis@gmail.com',
        password: '123456789',
        role: ROLES.ADMIN,
        genero: GENEROS.MASCULINO,
        config_notificacion: [],
        token_app: '',
      };
      const userCreated = await this.userService.createUser(user);
      await this.createTiendas(userCreated.id);

      const user2: CreateUserDto = {
        nombre: 'Maria',
        apellido: 'Romero',
        email: 'maria@gmail.com',
        password: '123456789',
        role: ROLES.BASIC,
        genero: GENEROS.FEMENINO,
        config_notificacion: [],
        token_app: '',
      };
      await this.userService.createUser(user2);

      return { message: 'Seeders ejecutados correctamente' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  private async createTiendas(usuarioID: string) {
    try {
      const tiendas: CreateTiendaDto = {
        nombre: 'Tienda Amiga',
        description: 'Tienda de barrio',
        direccionTexto: 'Calle 1 # 2 - 3',
        longitud: '4.1234567',
        latitud: '-74.1234567',
        correo: 'tienda@gmail.com',
        encargado: usuarioID,
        horarioAtencion: 'Lunes a Viernes 8:00 am - 5:00 pm',
        peso: 1,
        telefono: '656956232',
        estaSuspendido: false,
      }
      await this.tiendaService.create(tiendas);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
