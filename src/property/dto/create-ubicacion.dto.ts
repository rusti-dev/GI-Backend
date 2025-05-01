import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUbicacionDto{
 @ApiProperty({
   description: 'Dirección exacta del inmueble', 
   example: 'Av. Principal 123, Barrio Centro',
})
@IsString()
@IsNotEmpty()
direccion: string;

@ApiProperty({
    description: 'País donde se encuentra el inmueble', 
    example: 'Bolivia',
 })
 @IsString()
 @IsNotEmpty()
 pais: string 

 @ApiProperty({
    description: 'Ciudad donde se encuentra el inmueble', 
    example: 'Santa Cruz',
 })
 @IsString()
 @IsNotEmpty()
 ciudad: string

 @ApiProperty({
    description: 'Latitud geográfica del inmueble',
    example: -16.500000,
 })
 @IsNumber()
 @IsNotEmpty() 
latitud: number

@ApiProperty({
    description: 'Longitud geográfica del inmueble',
    example: -68.150000,
 })
 @IsNumber()
 @IsNotEmpty() 
longitud: number
}