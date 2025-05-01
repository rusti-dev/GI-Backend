import { Injectable,  Logger} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { CreateUbicacionDto } from '../dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from '../dto/update-ubicacion.dto'; 
import { ConfigService } from '@nestjs/config';
import { UbicacionEntity } from '../entities/ubicacion.entity';


@Injectable()
export class UbicacionService {
  private readonly logger = new Logger('UbicacionService');
  
   constructor(@InjectRepository(UbicacionEntity)
    private readonly ubicacionRepository: Repository<UbicacionEntity>,
    private configService: ConfigService
   ){}

    public async create(createUbicacionDto: CreateUbicacionDto): Promise<ResponseMessage>{
    try{
     const ubicacion = this.ubicacionRepository.create({...createUbicacionDto});
     await this.ubicacionRepository.save(ubicacion);
     return {
        statusCode: 201,
        data: ubicacion,
     }
    }catch(error){
      handlerError(error, this.logger);
    }
   }

     public async findAll(queryDto: QueryDto): Promise<ResponseGet>{
      try{
       const {limit,offset, order, attr, value }=queryDto;
       const query = this.ubicacionRepository.createQueryBuilder('ubicacion');
       if(limit)
         query.take(limit);
   
       if(offset)
         query.skip(offset);
       
       if(order)
         query.orderBy('ubicacion.id', order.toLocaleUpperCase() as any);
       
       if(attr && value)
         query.andWhere(`ubicacion.${attr} ILIKE :value`, { value: `%${value}%` });
   
       const [data,countData]= await query.getManyAndCount();
       return {
         data,
         countData,
       } 
     }catch(error){
       handlerError(error,this.logger);
      } 
     }
   
     public async findOne(id:string): Promise<UbicacionEntity> {
       try{
       const ubicacion = await this.ubicacionRepository.findOne({
         where: {id},
         relations:['property',],
       });
   
       if(!ubicacion){
        throw new Error('Ubicacion not found'); 
       }
       return ubicacion; 
      }catch(error){
       handlerError(error,this.logger);
      }
     }
   
     public async update(id: string, updateUbicacionDto: UpdateUbicacionDto): Promise<ResponseMessage> {
      try{
       const ubicacion = await this.ubicacionRepository.findOne({ where: {id}});
       if(!ubicacion){
        throw new Error('Ubicacion not found'); 
       }
       await this.ubicacionRepository.update(id,updateUbicacionDto);
       return{
         statusCode: 200,
         data: await this.ubicacionRepository.findOne({ where: {id}}),
       }
      }catch(error){
       handlerError(error,this.logger); 
      } 
     }
   
     public async delete(id: string): Promise<ResponseMessage> {
      try{ 
       const ubicacion = await this.ubicacionRepository.findOne({ where: {id}});
       if(!ubicacion){
        throw new Error('Ubicacion not found'); 
       }
       const result=await this.ubicacionRepository.remove(ubicacion);
       if(!result){ 
        throw new Error('Ubicacion not deleted');
       }
       return {
         statusCode: 200,
         message: 'Ubicacion deleted successfully'};
      }catch(error){
       handlerError(error,this.logger); 
      }
     }
}
