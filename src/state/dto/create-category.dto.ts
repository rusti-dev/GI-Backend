import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID,IsArray } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Departamento',
    description: 'Nombre de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}