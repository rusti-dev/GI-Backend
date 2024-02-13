import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TiendaFavoritoEntity } from '../entities/tienda_favorito.entity';
import { TiendaService } from './tienda.service';
import { UserService } from '../../users/services/users.service';
import { TiendaEntity } from '../entities/tienda.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { handlerError } from '../../../common/utils/handlerError.utils';
import { QueryDto } from '../../../common/dto/query.dto';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';

@Injectable()
export class TiendaFavoritoService {
    private readonly logger = new Logger('TiendaFavoritoService');

    constructor(
        @InjectRepository(TiendaFavoritoEntity) private readonly tiendaFavoritoRepository: Repository<TiendaFavoritoEntity>,
        private readonly tiendaService: TiendaService,
        private readonly usersService: UserService,
    ) { }

    public async create(tiendaId: string, usuarioId: string): Promise<TiendaFavoritoEntity> {
        try {
            const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const tienda: TiendaEntity = await this.tiendaService.findOne(tiendaId);
            const usuario: UsersEntity = await this.usersService.findOne(usuarioId);
            const tiendaVisitaCreated: TiendaFavoritoEntity = await this.tiendaFavoritoRepository.save({ fecha, tienda, usuario });
            return tiendaVisitaCreated;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findAll(queryDto: QueryDto, usuarioId: string): Promise<TiendaFavoritoEntity[]> {
        try {
            const { limit, offset, attr, value, order } = queryDto;
            const query = this.tiendaFavoritoRepository.createQueryBuilder('tiendaFavorito');
            query.leftJoinAndSelect('tiendaFavorito.tienda', 'tienda');
            query.leftJoin('tiendaFavorito.usuario', 'usuario');
            query.where('tiendaFavorito.usuario.id = :usuarioId', { usuarioId });
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('tiendaFavorito.createdAt', order.toLocaleUpperCase() as any);
            if (attr && value) query.where(`tiendaFavorito.${attr} ILIKE :value`, { value: `%${value}%` });
            return await query.getMany();
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async findOne(id: string): Promise<TiendaFavoritoEntity> {
        try {
            return await this.tiendaFavoritoRepository.findOne({ where: { id } });
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async remove(id: string, usuarioId: string): Promise<ResponseMessage> {
        try {
            const tiendaVisita = await this.tiendaFavoritoRepository.findOne({ where: { id, usuario: { id: usuarioId } } });
            if (!tiendaVisita) throw new NotFoundException('Favoritos not found.');
            const tiendaVisitasDeleted = await this.tiendaFavoritoRepository.delete(tiendaVisita.id);
            if (tiendaVisitasDeleted.affected === 0) throw new NotFoundException('Favoritos no eliminada.');
            return {
                message: 'Visita deleted successfully',
                statusCode: 200,
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
