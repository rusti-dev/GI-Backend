import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne} from 'typeorm';
import { PropertyEntity } from './property.entity';
//import {DuenoEntity} from

@Entity({ name: 'property_dueno' })
export class PropertyDuenoEntity extends BaseEntity {
    /*esto es una entidad piloto 
    por si alguien esta trabajando */

 //relacion
 @ManyToOne( ()=>PropertyEntity,(property)=> property.propertys_duenos)
 property: PropertyEntity;
 
 //@ManyToOne( ()=>DuenoEntity,(dueno)=> dueno.property_dueno,{onDelete: 'CASCADE'})
 //dueno: DuenoEntity;

}