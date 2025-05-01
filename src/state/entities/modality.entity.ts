import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('modalities')
export class ModalityEntity extends BaseEntity {
  @Column({ length: 100 })
  name: string;
}
