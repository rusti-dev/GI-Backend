import { PartialType } from '@nestjs/swagger';
import { ContractType, ContractStatus, ContractFormat } from '@/property/entities/contract.entity';
import { IsString, IsNumber, IsDate, IsNotEmpty, IsEnum, IsEmail, IsOptional } from 'class-validator';



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
    clientName: string;

    @IsString()
    @IsNotEmpty()
    clientDocument: string;

    @IsString()
    @IsOptional()
    clientPhone?: string;

    @IsEmail()
    @IsOptional()
    clientEmail?: string;

    @IsString()
    @IsNotEmpty()
    agentName: string;

    @IsString()
    @IsNotEmpty()
    agentDocument: string;

    @IsString()
    @IsNotEmpty()
    contractContent: string; // Base64 o HTML

    @IsEnum(ContractFormat)
    @IsNotEmpty()
    contractFormat: ContractFormat;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @IsNotEmpty()
    propertyId: number;

    @IsNumber()
    @IsNotEmpty()
    paymentMethodId: number;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
