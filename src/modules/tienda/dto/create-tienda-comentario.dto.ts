import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateTiendaComentarioDto {

    @ApiProperty({
        example: '4e5f9d5c-7b3a-4a0b-8c7a-0b2d9d6f7e5f',
        type: String,
        description: 'Id de la Tienda',
    })
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    tienda: string;

    @ApiProperty({
        example: 'Comentario de la tienda',
        type: String,
        description: 'Comentario de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    comentario: string;
}