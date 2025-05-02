import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, ManyToOne} from 'typeorm';
import { PropertyEntity } from './property.entity';
import { OwnerEntity } from '@/users/entities/owner.entity';

@Entity({ name: 'property_owner' })
export class PropertyOwnerEntity extends BaseEntity {

 //relacion
 @ManyToOne( ()=>PropertyEntity,(property)=> property.property_owner,{onDelete: 'CASCADE'})
 property: PropertyEntity;
 
 @ManyToOne( ()=>OwnerEntity,(owner)=> owner.property_owner,{onDelete: 'CASCADE'})
 owner: OwnerEntity;

}