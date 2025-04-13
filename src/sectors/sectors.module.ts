import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorsService } from './sectors.service';
import { SectorEntity } from './entities/sector.entity';
import { SectorsController } from './sectors.controller';



@Module({
    imports: [
        TypeOrmModule.forFeature([ SectorEntity ]),
    ],
    controllers: [ SectorsController ],
    providers: [ SectorsService ],
    exports: [ SectorsService ],
})
export class SectorsModule {}
