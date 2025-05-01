import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import { PropertyEntity } from './property.entity';

@Entity({ name: 'ubicacion' })
export class UbicacionEntity extends BaseEntity {

@Column({type:'varchar',nullable: false})
direccion: string;

@Column({type:'varchar',nullable: false})
pais: string;

@Column({type:'varchar',nullable: false})
ciudad: string;

@Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
latitud: number;

@Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
longitud:number;

 //relacion
 @OneToOne(()=>PropertyEntity)
 @JoinColumn()
 property: PropertyEntity;    
}