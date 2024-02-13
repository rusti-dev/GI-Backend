import { ApiProperty } from "@nestjs/swagger";
import { BaseType } from "src/common/swagger/base-type.swagger";

export class TiendaType {
    @ApiProperty()
    nombre: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    direccionTexto: string;

    @ApiProperty()
    longitud: string;

    @ApiProperty()
    latitud: string;

    @ApiProperty()
    horarioAtencion: string;

    @ApiProperty()
    telefono: string;

    @ApiProperty()
    correo: string;

    @ApiProperty()
    peso: number;

    @ApiProperty()
    estaSuspendido: boolean;
    // encargado: UsersEntity;

    // visitas: TiendaVisitasEntity[];

    // valoraciones: TiendaValoracionEntity[];

    // imagenes: TiendaImgEntity[];

    // comentarios: TiendaComentarioEntity[];
}

export class TiendaCreateType extends BaseType {
    @ApiProperty()
    data: TiendaType
}
