import { Module } from '@nestjs/common';
import { UsersController } from './controllers/realstate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RealStateEntity } from './entities/realstate.entity';
import { RealStateService } from './services/realstate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealStateEntity,
    ]),
    ConfigModule,
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    RealStateService,
  ],
  exports: [
    RealStateService,
    TypeOrmModule,
  ],
})
export class RealstateModule { }
