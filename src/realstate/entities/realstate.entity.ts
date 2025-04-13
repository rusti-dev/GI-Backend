import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SectorEntity } from './sector.entity';
import { SubscriptionEntity } from './subscription.entity';

@Entity({ name: 'realstate' })
export class RealStateEntity extends BaseEntity {

  @Column({ type: 'varchar', nullable: false, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  address: string;

  @OneToMany(() => SectorEntity, (sector) => sector.realState, { onDelete: 'CASCADE' })
  sectores: SectorEntity[];

  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.realState, { onDelete: 'CASCADE', nullable: true })
  subscription: SubscriptionEntity;
}
