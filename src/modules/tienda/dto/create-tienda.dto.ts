import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTiendaDto {
    @ApiProperty({
        example: 'Tienda Amiga',
        type: String,
        description: 'Nombre de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(150)
    nombre: string;

    @ApiProperty({
        example: 'Tienda de barrio',
        type: String,
        description: 'Descripción de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(300)
    description: string;

    @ApiProperty({
        example: 'Calle 1 # 2 - 3',
        type: String,
        description: 'Dirección de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(300)
    direccionTexto: string;

    @ApiProperty({
        example: '4.1234567',
        type: String,
        description: 'longitud de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    longitud: string;

    @ApiProperty({
        example: '-74.1234567',
        type: String,
        description: 'latitud de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    latitud: string;

    @ApiProperty({
        example: 'Lunes a viernes 8am - 5pm',
        type: String,
        description: 'Horario de atención de la tienda',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    horarioAtencion: string;

    @ApiProperty({
        example: '1234567',
        type: String,
        description: 'Teléfono de la tienda',
        nullable: true
    })
    @IsString()
    @MinLength(2)
    @MaxLength(15)
    @IsOptional()
    telefono: string;

    @ApiProperty({
        example: '',
        type: String,
        description: 'Correo electrónico de la tienda',
        nullable: true
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    correo: string;

    @ApiProperty({
        example: '1',
        type: Number,
        description: 'Reelevancia de la tienda',
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    peso: number;

    @ApiProperty({
        example: 'false',
        type: Boolean,
        description: 'Estado de la tienda',
    })
    @IsBoolean()
    @IsOptional()
    estaSuspendido: boolean;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
        description: 'Id del encargado de la tienda',
    })
    @IsNotEmpty()
    @IsUUID()
    @IsString()
    encargado: string;
}

