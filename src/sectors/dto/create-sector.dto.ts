import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';



export class CreateSectorDto {
    @ApiProperty({
        example: 'Sector Central',
        type: String,
        description: 'Nombre del sector',
    })
    @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 'Calle Principal #123',
        type: String,
        description: 'Dirección del sector',
    })
    @IsNotEmpty() @IsString() @MinLength(5) @MaxLength(100)
    adress: string;

    @ApiProperty({
        example: '12345678',
        type: String,
        description: 'Número de teléfono del sector',
        nullable: true,
        required: false,
    })
    @IsNotEmpty() @IsString() @MinLength(5) @MaxLength(15)
    phone: string;
}
