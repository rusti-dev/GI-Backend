import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';



export class CreateImageDto {
    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'URL de la imagen',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    url: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID de la propiedad asociada',
    })
    @IsNotEmpty()
    @IsUUID()
    propertyId: string;
}
