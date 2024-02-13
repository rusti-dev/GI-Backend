import { UsersEntity } from "../../users/entities/users.entity";
import { TiendaComentarioEntity } from "../entities/tienda_comentario.entity";

export interface ITienda {
    nombre: string;
    description: string;
    direccionTexto: string;
    longitud: string;
    latitud: string;
    horarioAtencion: string;
    telefono: string;
    correo: string;
    peso: number;
    estaSuspendido: boolean;
    encargado: UsersEntity;

    comentarios: TiendaComentarioEntity[];
}