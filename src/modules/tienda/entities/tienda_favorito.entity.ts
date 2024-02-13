import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { TiendaEntity } from "./tienda.entity";
import { ITiendaFavorito } from "../interfaces/tienda_favorito.interface";
import { UsersEntity } from "../../users/entities/users.entity";

@Entity({ name: 'tienda_favorito' })
export class TiendaFavoritoEntity extends BaseEntity implements ITiendaFavorito {

    @Column({ type: 'varchar', length: 10, nullable: false })
    fecha: string;

    @ManyToOne(() => TiendaEntity, tienda => "", { nullable: false, onDelete: 'CASCADE' })
    tienda: TiendaEntity;

    @ManyToOne(() => UsersEntity, user => user.tiendasFavoritas, { nullable: false, onDelete: 'CASCADE' })
    usuario: UsersEntity;
}