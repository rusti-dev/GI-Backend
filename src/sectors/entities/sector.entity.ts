import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';



@Entity({ name: 'sector' })
export class SectorEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, length: 100 })
    name: string;

    @Column({ type: 'varchar', nullable: false, length: 100 })
    adress: string;

    @Column({ type: 'varchar', nullable: false, length: 15 })
    phone: string;
}
