import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PropertyService } from './services/property.service';
import { PropertyController } from './controllers/property.controller';
import { PropertyEntity } from './entities/property.entity';
import { UbicacionService } from './services/ubicacion.service';
import { UbicacionController } from './controllers/ubicacion.controller';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { SectorsModule } from '@/sectors/sectors.module'; 
import { UsersModule } from '@/users/users.module';
import { StateModule } from '@/state/state.module';


@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity,UbicacionEntity]),
   UsersModule,
   SectorsModule,
   StateModule,
   ConfigModule
  ],

  controllers: [PropertyController, UbicacionController],
  providers: [PropertyService, UbicacionService],
  exports: [PropertyService, UbicacionService,TypeOrmModule],
})
export class PropertyModule {}
