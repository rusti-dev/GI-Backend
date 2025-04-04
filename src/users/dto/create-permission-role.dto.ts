import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePermissionRoleDto {
  @ApiProperty({
    example: '1b742c01-6dd2-47d2-8959-7d93f44ea86e(ejemplo)',
    type: String,
    description: 'Id del permiso',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  permission: string;

  @ApiProperty({
    example: '1b742c01-6dd2-47d2-8959-7d93f44ea86e(ejemplo)',
    type: String,
    description: 'Id del rol',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  role: string;
}
