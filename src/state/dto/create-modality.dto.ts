import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModalityDto {
  @ApiProperty({
    example: 'Venta',
    description: 'Venta, Alquiler, Anticretico,etc',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  }
