import { BaseEntity } from '@/common/entities/base.entity';
import { PropertyEntity } from '@/property/entities/property.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('modalities')
export class ModalityEntity extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @OneToMany( ()=> PropertyEntity, (property)=> property.modality)
  propertys: PropertyEntity[];
}
