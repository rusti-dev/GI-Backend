import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';



@Entity({ name: 'client' })
export class ClientEntity extends BaseEntity {
    @Column({ type: 'int', unique: true, nullable: false })
    ci: number;

    @Column({ type: 'varchar', nullable: false, length: 100 })
    name: string;

    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    email: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true, length: 15 })
    phone: string;
}
