import { UsersEntity } from "../../users/entities/users.entity";
import { TiendaEntity } from "../entities/tienda.entity";

export interface ITiendaComentario {
    fecha: string;
    hora: string;
    comentario: string;
    tienda: TiendaEntity;
    usuario: UsersEntity;
}