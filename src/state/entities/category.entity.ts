import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany} from 'typeorm';
import { PropertyEntity } from '@/property/entities/property.entity';


@Entity('categories')
export class Category extends BaseEntity{

  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany( ()=> PropertyEntity, (property) => property.category)
   propertys: PropertyEntity[];  
}
