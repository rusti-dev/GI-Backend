import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';


/**
 * UpdateClientDto is a Data Transfer Object (DTO) that extends the CreateClientDto.
 * It is used to update an existing client with partial properties.
 * The PartialType utility makes all properties of CreateClientDto optional.
 */
export class UpdateClientDto extends PartialType(CreateClientDto) {}
