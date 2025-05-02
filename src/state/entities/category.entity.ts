import { BaseEntity } from '@/common/entities/base.entity';
import { PropertyEntity } from '@/property/entities/property.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {

  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany( ()=> PropertyEntity, (property) => property.category)
   propertys: PropertyEntity[];  
}
