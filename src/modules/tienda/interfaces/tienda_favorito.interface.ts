import { UsersEntity } from "../../users/entities/users.entity";
import { TiendaEntity } from "../entities/tienda.entity";

export interface ITiendaFavorito {
    fecha: string;
    tienda: TiendaEntity;
    usuario: UsersEntity;
}