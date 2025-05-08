import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { StateModule } from '@/state/state.module';
import { ImagenEntity } from './entities/imagen.entity';
import { SectorsModule } from '@/sectors/sectors.module'; 
import { ImagesService } from './services/image.service';
import { PropertyEntity } from './entities/property.entity';
import { PropertyService } from './services/property.service';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { CloudinaryProvider } from '@/config/cloudinary.config';
import { UbicacionService } from './services/ubicacion.service';
import { ImagesController } from './controllers/image.controller';
import { PropertyController } from './controllers/property.controller';
import { UbicacionController } from './controllers/ubicacion.controller';



@Module({
    imports: [
        TypeOrmModule.forFeature([
            PropertyEntity, UbicacionEntity, ImagenEntity
        ]),
        UsersModule,
        SectorsModule,
        StateModule,
        ConfigModule
    ],
    controllers: [
        PropertyController, UbicacionController, ImagesController
    ],
    providers: [
        PropertyService, UbicacionService, CloudinaryProvider, ImagesService
    ],
    exports: [
        PropertyService, UbicacionService,TypeOrmModule, ImagesService
    ],
})

export class PropertyModule {}
