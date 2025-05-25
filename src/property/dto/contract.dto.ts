import { PartialType } from '@nestjs/swagger';
import { ContractType, ContractStatus } from '@/property/entities/contract.entity';
import { IsString, IsNumber, IsDate, IsNotEmpty, IsEnum } from 'class-validator';



export class CreateContractDto {
    @IsNumber()
    @IsNotEmpty()
    contractNumber: number;

    @IsEnum(ContractType)
    @IsNotEmpty()
    type: ContractType;

    @IsEnum(ContractStatus)
    @IsNotEmpty()
    status: ContractStatus;

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
