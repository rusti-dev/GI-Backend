import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorEntity } from './entities/sector.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handlerError.utils';



@Injectable()
export class SectorsService {
    private readonly logger = new Logger('SectorsService');
  
    constructor(
        @InjectRepository(SectorEntity)
        private readonly sectorRepository: Repository<SectorEntity>,
    ) {}
  
    public async create(createSectorDto: CreateSectorDto): Promise<SectorEntity> {
        try {
            const sector = this.sectorRepository.create(createSectorDto);
            return await this.sectorRepository.save(sector);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
  
    public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
        try {
            const { limit, offset, order, attr, value } = queryDto;
            const query = this.sectorRepository.createQueryBuilder('sector');
        
            if (limit) query.take(limit);
            if (offset) query.skip(offset);
            if (order) query.orderBy('sector.name', order.toUpperCase() as any);
            if (attr && value) {
                query.andWhere(`sector.${attr} ILIKE :value`, { value: `%${value}%` });
            }
            return {
                data: await query.getMany(),
                countData: await query.getCount(),
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
  
    public async findOne(id: string): Promise<SectorEntity> {
        try {
            const sector = await this.sectorRepository.findOneBy({ id });
            if (!sector) throw new NotFoundException('Sector no encontrado.');
            return sector;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
  
    public async update( id: string, updateSectorDto: UpdateSectorDto ): Promise<SectorEntity> {
        try {
            const sector = await this.findOne(id);
            Object.assign(sector, updateSectorDto);
            return await this.sectorRepository.save(sector);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
  
    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const sector = await this.findOne(id);
            const result = await this.sectorRepository.remove(sector);
            if (!result) throw new BadRequestException('El sector no se pudo eliminar.');
            return { statusCode: 200, message: 'Sector eliminado correctamente.' };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
