import { PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';



export class CreateContractDto {
    @IsNumber()
    @IsNotEmpty()
    contractNumber: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    notes: string;

    @IsNumber()
    @IsNotEmpty()
    propertyId: number;

    @IsNumber()
    @IsNotEmpty()
    paymentMethodId: number;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
