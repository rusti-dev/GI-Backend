import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TiendaService } from './services/tienda.service';
import { TiendaController } from './controllers/tienda.controller';
import { TiendaFavoritoController } from './controllers/tienda-favorito.controller';
import { TiendaFavoritoService } from './services/tienda-favorito.service';
import { UsersModule } from '../users/users.module';
import { TiendaEntity } from './entities/tienda.entity';
import { TiendaFavoritoEntity } from './entities/tienda_favorito.entity';
import { TiendaComentarioEntity } from './entities/tienda_comentario.entity';
import { TiendaComentarioController } from './controllers/tienda-comentario.controller';
import { TiendaComentarioService } from './services/tienda-comentario.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TiendaEntity,
      TiendaFavoritoEntity,
      TiendaComentarioEntity,
    ]),
    UsersModule,
  ],
  controllers: [TiendaController, TiendaFavoritoController, TiendaComentarioController],
  providers: [TiendaService, TiendaFavoritoService, TiendaComentarioService],
  exports: [TiendaService, TiendaFavoritoService],
})
export class TiendaModule { }
