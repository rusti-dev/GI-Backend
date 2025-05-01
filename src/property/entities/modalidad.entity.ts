import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany} from 'typeorm';
import { PropertyEntity } from './property.entity';

@Entity({ name: 'modalidad' })
export class ModalidadEntity extends BaseEntity{
 /*esto es una entidad piloto 
  por si alguien esta trabajando esa entidad*/
  
 //relaciones
 @OneToMany( ()=> PropertyEntity, (property)=> property.modalidad)
 propertys: PropertyEntity[];  
}