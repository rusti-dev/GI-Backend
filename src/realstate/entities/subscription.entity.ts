import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RealStateEntity } from './realstate.entity';
import { PlanEntity } from './Plan.entity';
import { SubscriptionPaymentEntity } from './subscription_payment.entity';

@Entity({ name: 'subscription' })
export class SubscriptionEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 100, nullable: false })
  init_date: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  end_date: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_payment_date: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  next_payment_date: string

  @Column({ type: 'varchar', length: 100, nullable: false, enum: ['active', 'inactive', 'pending'], default: 'active' })
  state: string

  @Column({ type: 'boolean', nullable: false, default: false })
  renewal: boolean

  @OneToOne(() => RealStateEntity, (realState) => realState.subscription, { onDelete: 'CASCADE' })
  realState: RealStateEntity

  @ManyToOne(() => PlanEntity, (plan) => plan.subscriptions, { onDelete: 'CASCADE' })
  plan: PlanEntity

  @OneToMany(() => SubscriptionPaymentEntity, (subscriptionPay) => subscriptionPay.subscription, { onDelete: 'CASCADE', nullable: true })
  subscription_payments: SubscriptionPaymentEntity[]

}
