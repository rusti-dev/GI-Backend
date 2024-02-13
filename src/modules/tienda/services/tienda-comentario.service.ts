import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TiendaService } from './tienda.service';
import { UserService } from '../../users/services/users.service';
import { TiendaEntity } from '../entities/tienda.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { handlerError } from '../../../common/utils/handlerError.utils';
import { QueryDto } from '../../../common/dto/query.dto';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';
import { TiendaComentarioEntity } from '../entities/tienda_comentario.entity';
import { CreateTiendaComentarioDto } from '../dto';


@Injectable()
export class TiendaComentarioService {
    private readonly logger = new Logger('TiendaComentarioService');

    constructor(
        @InjectRepository(TiendaComentarioEntity) private readonly tiendaComentarioRepository: Repository<TiendaComentarioEntity>,
        private readonly tiendaService: TiendaService,
        private readonly usersService: UserService,
    ) { }

    public async create(createTiendaComentarioDto: CreateTiendaComentarioDto, usuarioId: string): Promise<TiendaComentarioEntity> {
        try {
            const { tienda: tiendaId, comentario } = createTiendaComentarioDto;
            const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const tienda: TiendaEntity = await this.tiendaService.findOne(tiendaId);
            const usuario: UsersEntity = await this.usersService.findOne(usuarioId);
            const tiendaComentarioCreated: TiendaComentarioEntity = await this.tiendaComentarioRepository.save({ fecha, hora, tienda, usuario, comentario });
            return tiendaComentarioCreated;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAllByUser(queryDto: QueryDto, usuarioId: string): Promise<TiendaComentarioEntity[]> {
        try {
            const { limit, offset, attr, value, order } = queryDto;
            const query = this.tiendaComentarioRepository.createQueryBuilder('tiendaComentario');
            query.leftJoinAndSelect('tiendaComentario.tienda', 'tienda');
            query.leftJoin('tiendaComentario.usuario', 'usuario');
            query.where('tiendaComentario.usuario.id = :usuarioId', { usuarioId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('tiendaComentario.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) query.where(`tiendaComentario.${attr} ILIKE :value`, { value: `%${value}%` });
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAllByTienda(queryDto: QueryDto, tiendaId: string): Promise<TiendaComentarioEntity[]> {
        try {
            const { limit, offset, attr, value, order } = queryDto;
            console.log(queryDto, tiendaId);
            const query = this.tiendaComentarioRepository.createQueryBuilder('tiendaComentario');
            query.leftJoin('tiendaComentario.tienda', 'tienda');
            query.leftJoinAndSelect('tiendaComentario.usuario', 'usuario');
            query.where('tiendaComentario.tienda.id = :tiendaId', { tiendaId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('tiendaComentario.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) query.where(`tiendaComentario.${attr} ILIKE :value`, { value: `%${value}%` });
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<TiendaComentarioEntity> {
        try {
            return await this.tiendaComentarioRepository.findOne({ where: { id } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async GetByUserAndTienda(usuarioId: string, tiendaId: string): Promise<TiendaComentarioEntity> {
        try {
            return await this.tiendaComentarioRepository.findOne({ where: { usuario: { id: usuarioId }, tienda: { id: tiendaId } } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string, usuarioId: string): Promise<ResponseMessage> {
        try {
            const tiendaComentario = await this.tiendaComentarioRepository.findOne({ where: { id, usuario: { id: usuarioId } } });
            if (!tiendaComentario) throw new NotFoundException('Comentario not found.');
            const tiendaComentarioDeleted = await this.tiendaComentarioRepository.delete(tiendaComentario.id);
            if (tiendaComentarioDeleted.affected === 0) throw new NotFoundException('Comentario no eliminada.');
            return {
                message: 'Comentario deleted successfully',
                statusCode: 200,
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
