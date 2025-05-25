import { PropertyEntity } from "./property.entity";
import { BaseEntity } from "@/common/entities/base.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { PaymentMethodEntity } from "@/realstate/entities/payment_method.entity";



export enum ContractType {
    COMPRA = 'Compra',
    VENTA = 'Venta',
    ANTICRETICO = 'Anticrético'
}

export enum ContractStatus {
    VIGENTE = 'Vigente',
    FINALIZADO = 'Finalizado'
}

@Entity({ name: 'contract' })
export class ContractEntity extends BaseEntity {
    @Column({ type: 'number', nullable: false })
    contractNumber: number;

    @Column({
        type: 'enum',
        enum: ContractType,
        nullable: false
    })
    type: ContractType;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        nullable: false
    })
    status: ContractStatus;

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
