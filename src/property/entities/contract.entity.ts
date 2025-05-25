import { PropertyEntity } from "./property.entity";
import { BaseEntity } from "@/common/entities/base.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { PaymentMethodEntity } from "@/realstate/entities/payment_method.entity";



@Entity({ name: 'contract' })
export class ContractEntity extends BaseEntity {
    @Column({ type: 'number', nullable: false })
    contractNumber: number;

    @Column({ type: 'text', nullable: false })
    type: string;

    @Column({ type: 'text', nullable: false })
    status: string;

    @Column({ type: 'number', nullable: false })
    amount: number;
    
    @Column({ type: 'date', nullable: false })
    startDate: Date;
    
    @Column({ type: 'date', nullable: false })
    endDate: Date;
    
    @Column({ type: 'text', nullable: false })
    url: string;
    
    @Column({ type: 'text', nullable: false })
    notes: string;

    @OneToOne(() => PropertyEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: PropertyEntity;

    @OneToOne(() => PaymentMethodEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    payment_method: PaymentMethodEntity;
}
