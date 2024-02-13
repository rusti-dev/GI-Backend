import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TiendaEntity } from '../entities/tienda.entity';
import { CreateTiendaDto, UpdateTiendaDto } from '../dto';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';
import { handlerError } from '../../../common/utils/handlerError.utils';
import { QueryDto } from '../../../common/dto/query.dto';
import { UserService } from '../../users/services/users.service';

@Injectable()
export class TiendaService {
  private readonly logger = new Logger('TiendaService');

  constructor(
    @InjectRepository(TiendaEntity) private readonly tiendaRepository: Repository<TiendaEntity>,
    private readonly usersService: UserService,
  ) { }

  public async create(createTiendaDto: CreateTiendaDto): Promise<TiendaEntity> {
    try {
      const { encargado, ...rest } = createTiendaDto;
      const usuario = await this.usersService.findOne(encargado);
      const tiendaCreated = await this.tiendaRepository.save({ ...rest, encargado: usuario });
      return tiendaCreated;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<TiendaEntity[]> {
    try {
      const { limit, offset, attr, value, order } = queryDto;
      const query = this.tiendaRepository.createQueryBuilder('tienda');
      query.leftJoinAndSelect('tienda.encargado', 'encargado');
      query.leftJoinAndSelect('tienda.imagenes', 'imagenes');
      query.where('tienda.estaSuspendido = :estaSuspendido', { estaSuspendido: false });
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('tienda.createdAt', order.toLocaleUpperCase() as any);
      if (attr && value) query.where(`tienda.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAllAndSuspended(queryDto: QueryDto): Promise<TiendaEntity[]> {
    try {
      const { limit, offset, attr, value, order } = queryDto;
      const query = this.tiendaRepository.createQueryBuilder('tienda');
      query.leftJoinAndSelect('tienda.encargado', 'encargado');
      query.leftJoinAndSelect('tienda.imagenes', 'imagenes');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('tienda.createdAt', order.toLocaleUpperCase() as any);
      if (attr && value) query.where(`tienda.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  // recomendado por publicidad
  public async findPublicidad(queryDto: QueryDto): Promise<TiendaEntity[]> {
    try {
      const { limit, offset, attr, value, order = 'DESC' } = queryDto;
      const query = this.tiendaRepository.createQueryBuilder('tienda');
      query.leftJoinAndSelect('tienda.imagenes', 'imagenes');
      query.orderBy('tienda.peso', 'DESC');
      query.addOrderBy('RANDOM()');
      query.where('tienda.estaSuspendido = :estaSuspendido', { estaSuspendido: false });
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (attr && value) query.where(`tienda.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  // recomendado por visitas
  public async findPopulares(queryDto: QueryDto): Promise<TiendaEntity[]> {
    try {
      const { limit, offset, attr, value, order = 'DESC' } = queryDto;
      const query = this.tiendaRepository.createQueryBuilder('tienda');
      query.leftJoinAndSelect('tienda.imagenes', 'imagenes');
      query.innerJoin('tienda.visitas', 'tienda_visitas');
      query.where('tienda.estaSuspendido = :estaSuspendido', { estaSuspendido: false });
      query.groupBy('tienda.id');
      query.addGroupBy('imagenes.id');
      query.orderBy('COUNT(tienda_visitas.id)', order as any);
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (attr && value) query.where(`tienda.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  // // Recomendado para ti
  // public async findRecomendados(queryDto: QueryDto, userId: string): Promise<TiendaEntity[]> {
  //   try {
  //     const { limit, offset, attr, value, order = 'DESC' } = queryDto;
  //     const query = this.tiendaRepository.createQueryBuilder('tienda');
  //     query.leftJoinAndSelect('tienda.imagenes', 'imagenes');
  //     query.where('tienda.estaSuspendido = :estaSuspendido', { estaSuspendido: false });
  //     query.groupBy('tienda.id');
  //     query.addGroupBy('imagenes.id');
  //     if (limit) query.take(limit);
  //     if (offset) query.skip(offset);
  //     const tiendas = await query.getMany();
  //     return await query.getMany();
  //   } catch (error) {
  //     handlerError(error, this.logger);
  //   }
  // }



  public async findOne(id: string): Promise<TiendaEntity> {
    try {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id } });
      if (!tienda) throw new NotFoundException('Tienda no encontrada.');
      return tienda;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneByUserId(userId: string): Promise<TiendaEntity> {
    try {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { encargado: { id: userId } } });
      if (!tienda) throw new NotFoundException('Tienda no encontrada.');
      return tienda;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateTiendaDto: UpdateTiendaDto): Promise<TiendaEntity> {
    try {
      const { encargado, ...rest } = updateTiendaDto;
      const tienda = await this.findOne(id);
      const tiendaUpdated = await this.tiendaRepository.update(tienda.id, rest);
      if (tiendaUpdated.affected === 0) throw new NotFoundException('Tienda no actualizada.');
      return await this.findOne(id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async desuspend(id: string): Promise<ResponseMessage> {
    try {
      const tienda = await this.findOne(id);
      const tiendaUpdated = await this.tiendaRepository.update(tienda.id, { estaSuspendido: false });
      if (tiendaUpdated.affected === 0) throw new NotFoundException('Tienda no desuspendida.');
      return {
        message: 'Tienda desuspended successfully',
        statusCode: 200,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const tienda = await this.findOne(id);
      const tiendaUpdated = await this.tiendaRepository.update(tienda.id, { estaSuspendido: true });
      if (tiendaUpdated.affected === 0) throw new NotFoundException('Tienda no suspendida.');
      return {
        message: 'Tienda suspended successfully',
        statusCode: 200,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
