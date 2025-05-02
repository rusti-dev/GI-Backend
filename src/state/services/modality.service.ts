import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModalityEntity } from '../entities/modality.entity';
import { CreateModalityDto } from '../dto/create-modality.dto';
import { UpdateModalityDto } from '../dto/update-modality.dto';


@Injectable()
export class ModalityService {
  constructor(
    @InjectRepository(ModalityEntity)
    private readonly modalityRepository: Repository<ModalityEntity>,
  ) {}

  async create(createModalityDto: CreateModalityDto): Promise<ModalityEntity> {
    const modality = this.modalityRepository.create(createModalityDto);
    return this.modalityRepository.save(modality);
  }

  async findAll(): Promise<ModalityEntity[]> {
    return this.modalityRepository.find();
  }

  async findOne(id: string): Promise<ModalityEntity> {
    const modality = await this.modalityRepository.findOne({ where: { id } });
    if (!modality) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return modality;
  }

  async update(id: string, updateModalityDto: UpdateModalityDto): Promise<ModalityEntity> {
    const modality = await this.findOne(id);
    Object.assign(modality, updateModalityDto);
    return this.modalityRepository.save(modality);
  }

  async remove(id: string): Promise<void> {
    const modality = await this.findOne(id);
    await this.modalityRepository.remove(modality);
  }
}
