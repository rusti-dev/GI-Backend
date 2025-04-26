import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OwnerEntity } from "../entities/owner.entity";
import { Repository } from "typeorm";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { handlerError } from "@/common/utils";
import { QueryDto } from "@/common/dto/query.dto";
import { ResponseGet, ResponseMessage } from "@/common/interfaces";
import { UpdateOwnerDto } from "../dto/update-owner.dto";

@Injectable()
export class OwnerService {
  private readonly logger = new Logger('OwnerService');

  constructor(
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>,
  ) {}

  public async create(createOwnerDto: CreateOwnerDto): Promise<OwnerEntity> {
    try {
      const ownerCreated = this.ownerRepository.create(createOwnerDto);
      return await this.ownerRepository.save(ownerCreated);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto):Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.ownerRepository.createQueryBuilder('owner');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy(`owner.${attr}`, order.toLocaleUpperCase() as any);
      if (attr && value) query.andWhere(`owner.${attr} = :value`, { value });
      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<OwnerEntity> {
    try {
      return await this.ownerRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<OwnerEntity> {
    try {
      await this.ownerRepository.update(id, updateOwnerDto);
      return await this.findOne(id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const owner: OwnerEntity = await this.findOne(id);
      const ownerDeleted = await this.ownerRepository.update(owner.id, {
        isActive: false,
      })
      if (ownerDeleted.affected === 0) {
        throw new Error('El propietario no se ha podido eliminar');
      }
      return { statusCode: 200, message: 'Propietario eliminado correctamente' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

}