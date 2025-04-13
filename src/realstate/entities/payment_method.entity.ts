import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SubscriptionPaymentEntity } from './subscription_payment.entity';

enum method {
  cash = 'cash',
  credit_card = 'credit_card',
  crypto = 'crypto',
  qr_code = 'qr_code'
}

@Entity({ name: 'payment_method' })
export class PaymentMethodEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 100, nullable: false, enum: method, unique: true })
  name: method;

  @OneToMany(() => SubscriptionPaymentEntity, (subscriptionPay) => subscriptionPay.payment_method, { onDelete: 'CASCADE', nullable: true })
  subscription_payments: SubscriptionPaymentEntity[];
}
