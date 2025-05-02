import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePropertyOwnerDto {
    @ApiProperty({
        example: '1b742c01-6dd2-47d2-8959-7d93f44ea86e(ejemplo)',
        type: String,
        description: 'Id de property',
      })
      @IsNotEmpty()
      @IsString()
      @IsUUID()
      property: string;
    
      @ApiProperty({
        example: '1b742c01-6dd2-47d2-8959-7d93f44ea86e(ejemplo)',
        type: String,
        description: 'Id del owner',
      })
      @IsNotEmpty()
      @IsString()
      @IsUUID()
      owner: string;
  }