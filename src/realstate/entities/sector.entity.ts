import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RealStateEntity } from './realstate.entity';

@Entity({ name: 'sector' })
export class SectorEntity extends BaseEntity {

  @Column({ type: 'varchar', nullable: false, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  address: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  phone: string;

  @ManyToOne(() => RealStateEntity, (realState) => realState.sectores, { onDelete: 'CASCADE' })
  realState: RealStateEntity;

}
