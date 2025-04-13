import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorsService } from './sectors.service';
import { SectorEntity } from './entities/sector.entity';
import { SectorsController } from './sectors.controller';
import { UsersModule } from '@/users/users.module';



@Module({
    imports: [
        TypeOrmModule.forFeature([ SectorEntity ]),
        UsersModule,
    ],
    controllers: [ SectorsController ],
    providers: [ SectorsService ],
    exports: [ SectorsService ],
})
export class SectorsModule {}
