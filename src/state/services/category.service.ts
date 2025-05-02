import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    const updated = Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
