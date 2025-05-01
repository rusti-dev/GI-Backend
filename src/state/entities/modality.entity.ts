import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany} from 'typeorm';
import { PropertyEntity } from '@/property/entities/property.entity';

@Entity('modalities')
export class Modality extends BaseEntity{
  @Column({ length: 100 })
  name: string;

  @OneToMany( ()=> PropertyEntity, (property)=> property.modality)
   propertys: PropertyEntity[];
}
