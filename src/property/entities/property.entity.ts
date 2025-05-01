import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { CategoriaEntity } from './categoria.entity';
import { ModalidadEntity } from './modalidad.entity'; 
import { PropertyDuenoEntity } from './property_dueno.entity';
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
  
 @ManyToOne( ()=>CategoriaEntity, (categoria) => categoria.propertys,{onDelete: 'CASCADE'})
  categoria: CategoriaEntity;
 
 @ManyToOne(()=>ModalidadEntity, (modalidad)=> modalidad.propertys,{onDelete: 'CASCADE'})
  modalidad: ModalidadEntity;

 @ManyToOne( ()=>SectorEntity, (sector)=> sector.propertys,{onDelete: 'CASCADE'})
 sector: SectorEntity; 

 @OneToMany(()=>ImagenEntity, (imagen)=> imagen.property,{onDelete: 'CASCADE'})
 imagenes: ImagenEntity[];  
 
 @OneToOne(() => UbicacionEntity, (ubicacion) => ubicacion.property, { onDelete: 'CASCADE' })
 ubicacion: UbicacionEntity;
 
 @OneToMany(()=>PropertyDuenoEntity,(property_dueno)=> property_dueno.property,{onDelete: 'CASCADE'})
 propertys_duenos: PropertyDuenoEntity[];

}