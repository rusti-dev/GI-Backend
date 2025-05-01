import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {

  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
