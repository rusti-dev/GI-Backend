import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne} from 'typeorm';
import { PropertyEntity } from './property.entity';

@Entity({ name: 'imagen' })
export class ImagenEntity extends BaseEntity {
    /*esto es una entidad piloto 
    por si alguien esta trabajando */

 @ManyToOne(() => PropertyEntity, (property) => property.imagenes)
 property: PropertyEntity;    
}