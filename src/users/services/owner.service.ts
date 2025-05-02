import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OwnerEntity } from "../entities/owner.entity";
import { DataSource, Repository } from "typeorm";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { handlerError } from "@/common/utils";
import { QueryDto } from "@/common/dto/query.dto";
import { ResponseGet, ResponseMessage } from "@/common/interfaces";
import { UpdateOwnerDto } from "../dto/update-owner.dto";
import { PropertyOwnerEntity } from "@/property/entities/property_owner.entity";
import { PropertyEntity } from "@/property/entities/property.entity";

@Injectable()
export class OwnerService {
  private readonly logger = new Logger('OwnerService');

  constructor(
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>,
    @InjectRepository(PropertyOwnerEntity)
    private readonly propertyOwnerRepository: Repository<PropertyOwnerEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
    private readonly dataSources: DataSource,
  ) {}

  public async create(createOwnerDto: CreateOwnerDto): Promise<OwnerEntity> {
   const queryRunner = this.dataSources.createQueryRunner();
   await queryRunner.connect();
   await queryRunner.startTransaction();
    try {
      const {property,...ownerData}= createOwnerDto;

      const ownerCreated = this.ownerRepository.create(ownerData);
      await queryRunner.manager.save(ownerCreated);

      const propertyOwnerRecords = await Promise.all(
        property.map(async (propertyId) => {
          const propertyFound = await this.propertyRepository.findOneBy({ id: propertyId });
          if (!propertyFound) throw new Error(`Property ${propertyId} not found`);

          const propertyOwner = this.propertyOwnerRepository.create({
            owner: { id: ownerCreated.id },
            property: { id: propertyId },
          });
          return queryRunner.manager.save(propertyOwner);
        })
      );  
      await queryRunner.commitTransaction();
      return ownerCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handlerError(error, this.logger);
    } finally {
      await queryRunner.release();
    }
  }

  public async findAll(queryDto: QueryDto):Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.ownerRepository.createQueryBuilder('owner');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order && attr) {
        query.orderBy(`owner.${attr}`, order.toUpperCase() as 'ASC' | 'DESC');
      }
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
      return await this.ownerRepository.findOneOrFail({
        where: { id },
        relations: {
          property_owner: {
            property: true
          }
        }
      });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<OwnerEntity> {
    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const { property, ...ownerData } = updateOwnerDto;
  
      const owner = await this.ownerRepository.findOneBy({ id });
      if (!owner) throw new Error(`Owner with id ${id} not found`);
  
      await queryRunner.manager.update(OwnerEntity, id, ownerData);
  
      if (property && property.length > 0) {
        await queryRunner.manager.delete(PropertyOwnerEntity, { owner: { id } });
  
        const relations = await Promise.all(
          property.map(async (propertyId) => {
            const propertyFound = await this.propertyRepository.findOneBy({ id: propertyId });
            if (!propertyFound) throw new Error(`Property ${propertyId} not found`);
  
            const newRelation = this.propertyOwnerRepository.create({
              owner: { id },
              property: { id: propertyId },
            });
            return queryRunner.manager.save(newRelation);
          })
        );
      }
  
      await queryRunner.commitTransaction();
      return await this.findOne(id); // para devolver datos actualizados
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handlerError(error, this.logger);
    } finally {
      await queryRunner.release();
    }
  }
  public async delete(id: string): Promise<ResponseMessage> {
    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const owner = await this.findOne(id);
      if (!owner) throw new Error(`Owner with id ${id} not found`);
  
      const propertyOwnerRelations = await queryRunner.manager.find(PropertyOwnerEntity, {
        where: { owner: { id } },
        relations: ['property']
      });
  
      for (const relation of propertyOwnerRelations) {
        const propertyId = relation.property.id;
  
        const ownerCount = await queryRunner.manager.count(PropertyOwnerEntity, {
          where: { property: { id: propertyId } }
        });
  
        // Si solo tiene 1 dueño, se borra la propiedad
        if (ownerCount === 1) {
          await queryRunner.manager.delete(PropertyEntity, propertyId);
        }
  
        // Se elimina la relación propietario-propiedad
        await queryRunner.manager.delete(PropertyOwnerEntity, {
          owner: { id },
          property: { id: propertyId }
        });
      }
  
      const result = await queryRunner.manager.update(OwnerEntity, id, {
        isActive: false,
      });
  
      if (result.affected === 0) {
        throw new Error('El propietario no se ha podido eliminar');
      }
  
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: 'Propietario eliminado correctamente (y sus propiedades si era único dueño)',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handlerError(error, this.logger);
    } finally {
      await queryRunner.release();
    }
  }  
  /*el delete elimina hasta las propiedades bajo la siguiente condicion
   si hay varios inmuebles ligados a un solo usuario y este es eliminado 
   se borrara esos inmuebles */
}  