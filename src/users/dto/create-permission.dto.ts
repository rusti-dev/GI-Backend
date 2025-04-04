import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'usuario',
    type: String,
    description: 'Nombre del permiso, solo lo usa el sistema',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(70)
  name: string;

  @ApiProperty({
    example: 'Gestionar Usuarios',
    type: String,
    description: 'Descripcion del permiso, lo que ve el usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(70)
  description: string;

  @ApiProperty({
    example: 'Iventario',
    type: String,
    description: 'Tipo de permiso que se esta creando',
  })
  type: string
}
