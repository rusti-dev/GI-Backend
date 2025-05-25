import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from '../entities/contract.entity';
import { PropertyEntity } from '../entities/property.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto, UpdateContractDto } from '../dto/contract.dto';
import { PaymentMethodEntity } from '@/realstate/entities/payment_method.entity';



@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,
        @InjectRepository(PaymentMethodEntity)
        private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    ) {}

    async create(createContractDto: CreateContractDto): Promise<ContractEntity> {
        const property = await this.propertyRepository.findOne({ where: { id: String(createContractDto.propertyId) } });
        if (!property) {
            throw new NotFoundException('Propiedad no encontrada');
        }

        const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: String(createContractDto.paymentMethodId) } });
        if (!paymentMethod) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        const contract = this.contractRepository.create({
            ...createContractDto,
            property,
            payment_method: paymentMethod,
        });

        return await this.contractRepository.save(contract);
    }

    async findAll(): Promise<ContractEntity[]> {
        return await this.contractRepository.find({
            relations: ['property', 'payment_method'],
        });
    }

    async findOne(id: number): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: String(id) },
            relations: ['property', 'payment_method'],
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        return contract;
    }

    async update(id: number, updateContractDto: UpdateContractDto): Promise<ContractEntity> {
        const contract = await this.findOne(id);

        const property = await this.propertyRepository.findOne({ where: { id: String(updateContractDto.propertyId) } });
        if (!property) {
            throw new NotFoundException('Propiedad no encontrada');
        }

        const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: String(updateContractDto.paymentMethodId) } });
        if (!paymentMethod) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        Object.assign(contract, {
            ...updateContractDto,
            property,
            payment_method: paymentMethod,
        });

        return await this.contractRepository.save(contract);
    }

    async remove(id: number): Promise<void> {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract);
    }
}
