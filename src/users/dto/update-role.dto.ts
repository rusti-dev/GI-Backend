import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class UpdateRoleDto {

  @ApiProperty({
    example: 'Administrador SU',
    type: String,
    description: 'Nombre del rol',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(70)
  name: string;

  @ApiProperty({
    example: '["98eb0c23-eb75-4646-99c7-9e361726d8ee", "ID2"]',
    type: [String],
    description: 'Array de los ids de los permisos',
  })
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @IsUUID("4", { each: true })
  permissions: string[];
}
