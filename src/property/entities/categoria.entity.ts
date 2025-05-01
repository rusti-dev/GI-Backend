import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany} from 'typeorm';
import { PropertyEntity } from './property.entity';

@Entity({ name: 'categoria' })
export class CategoriaEntity extends BaseEntity {
 /*esta es una entidad piloto 
  por si alguien la esta haciendo */ 

 //relacion
 @OneToMany( ()=> PropertyEntity, (property) => property.categoria)
 propertys: PropertyEntity[];  
}