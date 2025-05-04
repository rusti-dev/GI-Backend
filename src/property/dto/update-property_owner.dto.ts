import { PartialType } from '@nestjs/swagger';
import { CreatePropertyOwnerDto } from './create-property_owner.dto';

export class UpdatePropertyOwnerDto extends PartialType(CreatePropertyOwnerDto) {}