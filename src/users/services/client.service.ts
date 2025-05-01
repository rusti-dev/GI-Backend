import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto, UpdateClientDto } from '../dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
    ) { }

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        const hashedPassword = await this.encryptPassword(createClientDto.password);
        const client = this.clientRepository.create({
            ...createClientDto,
            password: hashedPassword,
        });
        return this.clientRepository.save(client);
    }

    async findAll(): Promise<ClientEntity[]> {
        return this.clientRepository.find();
    }

    async findByEmail(email: string): Promise<ClientEntity | null> {
        return this.clientRepository.findOne({ where: { email } });
    }


    async findOne(id: string): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException('Client not found');
        }
        return client;
    }

    async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
        await this.clientRepository.update(id, updateClientDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.clientRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Client not found');
        }
    }


    public async encryptPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, +process.env.HASH_SALT);
    }
}
