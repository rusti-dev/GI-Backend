import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { Category} from '@/state/entities/category.entity';
import { Modality } from '@/state/entities/modality.entity'; 
import { PropertyOwnerEntity } from './property_owner.entity';
import { UbicacionEntity } from './ubicacion.entity';
import { ImagenEntity } from './imagen.entity';
import { SectorEntity } from '@/sectors/entities/sector.entity';


export enum EstadoProperty {
 DISPONIBLE = 'disponible',
 OCUPADO= 'ocupado',
}

@Entity({ name: 'property' })
export class PropertyEntity extends BaseEntity {

 @Column({ type: 'text', nullable: false })
 descripcion: string;  

 @Column({ type: 'decimal', nullable: false})
 precio:number;

 @Column({type: 'enum', enum: EstadoProperty,default: EstadoProperty.DISPONIBLE})
 estado: EstadoProperty;

 @Column({type:'decimal', nullable: false})
 area:number;

 @Column({type:'int', nullable: true})
 NroHabitaciones:number;

 @Column({type:'int', nullable: true})
 NroBanos:number;
 
 @Column({ type: 'int',nullable: true})
 NroEstacionamientos:number;

 /*relaciones*/ 

 @ManyToOne( ()=>UserEntity, (user) => user.propertys,{onDelete: 'CASCADE', nullable: true})
  user: UserEntity;
  
 @ManyToOne( ()=>Category, (category) => category.propertys,{onDelete: 'CASCADE'})
 category: Category;
 
 @ManyToOne(()=>Modality, (modality)=> modality.propertys,{onDelete: 'CASCADE'})
  modality: Modality;

 @ManyToOne( ()=>SectorEntity, (sector)=> sector.propertys,{onDelete: 'CASCADE'})
 sector: SectorEntity; 

 @OneToMany(()=>ImagenEntity, (imagen)=> imagen.property,{onDelete: 'CASCADE'})
 imagenes: ImagenEntity[];  
 
 @OneToOne(() => UbicacionEntity, (ubicacion) => ubicacion.property, { onDelete: 'CASCADE' })
 @JoinColumn()
 ubicacion: UbicacionEntity;
 
 @OneToMany(()=>PropertyOwnerEntity,(property_owner)=> property_owner.property,{onDelete: 'CASCADE'})
 property_owner: PropertyOwnerEntity[];

}