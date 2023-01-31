import { Injectable } from '@nestjs/common';
import {
  CategoryEntity,
  CategoryRepository,
} from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ExistingEntityException } from '../../../shared/exceptions/existing-entity.exception';
import { EntityNotFoundException } from '../../../shared/exceptions/entity-not-found.exception';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(
    body: CreateCategoryDto,
    userId: string,
  ): Promise<CategoryEntity> {
    const categoryExists = await this.categoryRepository.findByName(
      body.name,
      userId,
    );

    if (categoryExists) {
      throw new ExistingEntityException(
        'Já existe uma categoria com esse nome',
      );
    }

    return this.categoryRepository.create(body, userId);
  }

  async findAll(userId: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll(userId);
  }

  async findOne(id: string, userId: any): Promise<CategoryEntity> {
    const categoryFind = await this.categoryRepository.findOne(id, userId);

    if (!categoryFind) {
      throw new EntityNotFoundException('Categoria não encontrada');
    }

    return categoryFind;
  }

  async update(
    id: string,
    body: UpdateCategoryDto,
    userId: string,
  ): Promise<void> {
    const categoryFind = await this.categoryRepository.findOne(id, userId);

    if (!categoryFind) {
      throw new EntityNotFoundException('Categoria não existe');
    }

    const categoryExists = await this.categoryRepository.findByName(
      body.name,
      userId,
    );

    if (categoryExists !== null && categoryExists.id !== id) {
      throw new ExistingEntityException(
        'Já existe uma categoria com esse nome',
      );
    }

    await this.categoryRepository.update(id, body);
  }

  async delete(id: string, userId: string): Promise<void> {
    const categoryExists = await this.categoryRepository.findOne(id, userId);

    if (!categoryExists) {
      throw new EntityNotFoundException('Categoria não encontrada');
    }

    await this.categoryRepository.delete(id);
  }
}
