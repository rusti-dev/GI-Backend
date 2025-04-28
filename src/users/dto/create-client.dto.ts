import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';



export class CreateClientDto {
    @ApiProperty({ example: 11223344, description: 'Client CI' })
    @IsNotEmpty()
    @IsNumber()
    ci: number;

    @ApiProperty({ example: 'John Doe', description: 'Client name' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Client email' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: '12345678', description: 'Client phone', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(15)
    phone?: string;
}
