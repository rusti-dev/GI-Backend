import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateOwnerDto {
  @ApiProperty({
    example: 11223344,
    type: String,
    description: 'Carnet de identidad del propietario',
  })
  @IsNotEmpty() @IsString()
  ci: string;

  @ApiProperty({
    example: 'Propietario',
    type: String,
    description: 'Nombre del propietario',
  })
  @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Email del propietario',
    type: String,
    description: 'Correo electrónico del propietario',
  })
  @IsNotEmpty() @IsString() @IsEmail() @MaxLength(100)
  email: string;
  @ApiProperty({
    example: '12345678',
    type: String,
    description: 'Teléfono del propietario',
  })
  @IsNotEmpty() @IsString() @MinLength(6) @MaxLength(20)
  phone: string;
}