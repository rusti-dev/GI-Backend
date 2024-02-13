import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ROLES } from '../../../common/constants';
import { GENEROS, NOTIFICACIONES } from '../../../common/constants/configuracion';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Nombre del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Apellido del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  apellido: string;

  @ApiProperty({
    example: 'john@live.com',
    type: String,
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    type: String,
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'basic',
    enum: ROLES,
    description: 'Rol del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ROLES)
  role: ROLES;

  @ApiProperty({
    example: 'masculino',
    type: String,
    description: 'Genero del usuario (Opcional)',
  })
  @IsString()
  @IsOptional()
  @IsEnum(GENEROS)
  genero: GENEROS;

  @ApiProperty({
    example: `['ofertas', 'favoritos']`,
    type: Array,
    description:
      'Configuracion de si el usuario acepta/rechaza recibir notificaciones (Opcional)',
  })
  @IsOptional()
  @IsArray()
  config_notificacion: NOTIFICACIONES[];

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: String,
    description: 'Token para la aplicacion movil (Opcional)',
  })
  @IsOptional()
  @IsString()
  token_app: string;
}
