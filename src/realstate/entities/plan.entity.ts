import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CURRENCY } from 'src/common/constants';
import { SubscriptionEntity } from './subscription.entity';

export enum PlanInterval {
  month = 'month',
  year = 'year'
}

@Entity({ name: 'plan' })
export class PlanEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;

  @Column({ type: 'float', nullable: false })
  unit_amount: number;

  @Column({ type: 'enum', enum: CURRENCY, nullable: false, default: CURRENCY.USDT })
  currency: CURRENCY;

  @Column({ type: 'enum', enum: PlanInterval, nullable: false, default: PlanInterval.month })
  interval: PlanInterval;

  @Column({ type: 'varchar', nullable: true })
  contentHtml: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  is_active: boolean;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan, { onDelete: 'CASCADE', nullable: true })
  subscriptions: SubscriptionEntity[];

}
