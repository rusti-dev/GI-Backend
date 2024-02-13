import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";
import { TiendaComentarioEntity } from "./tienda_comentario.entity";
import { ITienda } from "../interfaces/tienda.interface";

@Entity({ name: 'tienda' })
export class TiendaEntity extends BaseEntity implements ITienda {

    @Column({ type: 'varchar', length: 150, nullable: false })
    nombre: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 300, nullable: false, name: 'direccion_texto' })
    direccionTexto: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    longitud: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    latitud: string;

    @Column({ type: 'varchar', length: 100, nullable: false, name: 'horario_atencion' })
    horarioAtencion: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo: string;

    @Column({ type: 'float', nullable: false, default: 1 })
    peso: number;

    @Column({ type: 'boolean', nullable: false, default: false, name: 'esta_suspendido' })
    estaSuspendido: boolean;

    @OneToOne(() => UsersEntity, user => user.tienda, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    encargado: UsersEntity;

    // relaciones con otras tablas
    @OneToMany(() => TiendaComentarioEntity, tiendaComentario => tiendaComentario.tienda)
    comentarios: TiendaComentarioEntity[];

}
