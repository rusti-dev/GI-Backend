import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTiendaVisitasDto {

    @ApiProperty({
        example: '4e5f9d5c-7b3a-4a0b-8c7a-0b2d9d6f7e5f',
        type: String,
        description: 'Id de la Tienda',
    })
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    tienda: string;
}