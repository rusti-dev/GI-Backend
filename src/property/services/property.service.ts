import { Injectable,  Logger} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { ConfigService } from '@nestjs/config';
import { PropertyEntity } from '../entities/property.entity';
import { SectorsService } from '@/sectors/sectors.service';
//import { UbicacionService } from './ubicacion.service';
import { UserService } from '@/users/services/users.service'; 
//import {CatgoriaService} from ''
//import {ModalidadService} from ''
//y importar lo de dueños y imagenes

@Injectable()
export class PropertyService {
 private readonly logger = new Logger('PropertyService');
 
  constructor(
   @InjectRepository(PropertyEntity)
   private readonly propertyRepository: Repository<PropertyEntity>,
   //private readonly ubicacionService: UbicacionService,
   private readonly sectorService: SectorsService,
   private readonly userService: UserService,
   private configService: ConfigService
  ){ }

  public async create(createPropertyDto: CreatePropertyDto): Promise<ResponseMessage>{
   try{
     const {user,sector,...property}=createPropertyDto;

     const userFound = await this.userService.findOne(user);
     const sectorFound = await this.sectorService.findOne(sector);
     const createProperty = this.propertyRepository.create({
                            ...property,
                            user: userFound,
                            sector: sectorFound,
                            categoria: property.categoria ? { id: property.categoria } : undefined,
                            modalidad: property.modalidad ? { id: property.modalidad } : undefined,
                            });

      const createdProperty = await this.propertyRepository.save(createProperty);
      return {
        statusCode: 201,
        data: createdProperty,
      };
    }catch(error){
      handlerError(error, this.logger)
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet>{
   try{
    const {limit,offset, order, attr, value }=queryDto;
    const query = this.propertyRepository.createQueryBuilder('property');
    if(limit)
      query.take(limit);

    if(offset)
      query.skip(offset);
    
    if(order)
      query.orderBy('property.id', order.toLocaleUpperCase() as any);
    
    if(attr && value)
      query.andWhere(`property.${attr} ILIKE :value`, { value: `%${value}%` });

    const [data,countData]= await query.getManyAndCount();
    return {
      data,
      countData,
    } 
  }catch(error){
    handlerError(error,this.logger);
   } 
  }

  public async findOne(id:string): Promise<PropertyEntity> {
    try{
    const property = await this.propertyRepository.findOne({
      where: {id},
      relations:[
        'user',
        'categoria',
        'modalidad',
        'sector',
        'imagenes',
        'ubicacion',
        'propertys_duenos'],
    });

    if(!property){
     throw new Error('Property not found'); 
    }
    return property; 
   }catch(error){
    handlerError(error,this.logger);
   }
  }

  public async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<ResponseMessage> {
   try{
    const property = await this.propertyRepository.findOne({ where: {id}});
    if(!property){
     throw new Error('Property not found'); 
    }
    //await this.propertyRepository.update(id,updatePropertyDto);
    return{
      statusCode: 200,
      data: await this.propertyRepository.findOne({ where: {id}}),
    }
   }catch(error){
    handlerError(error,this.logger); 
   } 
  }

  public async delete(id: string): Promise<ResponseMessage> {
   try{ 
    const property = await this.propertyRepository.findOne({ where: {id}});
    if(!property){
     throw new Error('Property not found'); 
    }
    const result=await this.propertyRepository.remove(property);
    if(!result){ 
     throw new Error('Property not deleted');
    }
    return {
      statusCode: 200,
      message: 'Property deleted successfully'};
   }catch(error){
    handlerError(error,this.logger); 
   }
  }
}