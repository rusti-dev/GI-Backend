import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength, } from 'class-validator';

export class CreateRoleDto {

  @ApiProperty({
    example: 'Administrador SU',
    type: String,
    description: 'Nombre del rol',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(70)
  name: string;

  @ApiProperty({
    example: '["ID1", "ID2"]',
    type: [String],
    description: 'Array de los ids de los permisos',
  })
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @IsUUID("4", { each: true })
  permissions: string[];
}
