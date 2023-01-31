import { Injectable } from '@nestjs/common';
import {
  CategoryEntity,
  CategoryRepository,
} from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ExistingEntityException } from '../../../shared/exceptions/existing-entity.exception';

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
}
