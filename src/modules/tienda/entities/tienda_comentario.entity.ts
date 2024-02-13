import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";
import { TiendaEntity } from "./tienda.entity";
import { ITiendaComentario } from "../interfaces/tienda_comentario.interface";

@Entity({ name: 'tienda_comentario' })
export class TiendaComentarioEntity extends BaseEntity implements ITiendaComentario {

    @Column({ type: 'varchar', length: 10, nullable: false })
    fecha: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    hora: string;

    @Column({ type: 'varchar', length: 500, nullable: false })
    comentario: string;

    @ManyToOne(() => TiendaEntity, tienda => tienda.comentarios, { nullable: false, onDelete: 'CASCADE' })
    tienda: TiendaEntity;

    @ManyToOne(() => UsersEntity, user => user.tiendaComentarios, { nullable: false, onDelete: 'CASCADE' })
    usuario: UsersEntity;
}