import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UsersModule } from '../modules/users/users.module';
import { TiendaModule } from 'src/modules/tienda/tienda.module';

@Module({
  imports: [UsersModule, TiendaModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeederModule { }
