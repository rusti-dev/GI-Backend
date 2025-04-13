import { Repository } from 'typeorm';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateRealState, UpdateRealStateDto } from '../dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseMessage } from 'src/common/interfaces';
import { RealStateEntity } from '../entities/realstate.entity';

@Injectable()
export class RealStateService {
  private readonly logger = new Logger('RealStateService');

  constructor(
    @InjectRepository(RealStateEntity)
    private readonly realStateRepository: Repository<RealStateEntity>,
  ) { }

  public async create(createRealState: CreateRealState): Promise<ResponseMessage> {
    try {

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseMessage> {
    try {

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<UserEntity> {
    try {

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, update: UpdateRealStateDto): Promise<ResponseMessage> {
    try {

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {

    } catch (error) {
      handlerError(error, this.logger);
    }
  }

}
