import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCustomerDto {
  @ApiProperty({
    example: 'cliente1@gmail.com',
    description: 'Correo electrónico del cliente',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña del cliente',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
