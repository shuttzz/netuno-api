import { User } from '@prisma/client';

export type CategoryEntity = {
  id?: string;
  name: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class CategoryRepository {
  abstract create(
    params: CategoryEntity,
    userId: string,
  ): Promise<CategoryEntity>;

  abstract findByName(name: string, userId: string): Promise<CategoryEntity>;

  abstract findOne(id: string, userId: string): Promise<CategoryEntity>;

  abstract findAll(userId: string): Promise<CategoryEntity[]>;

  abstract update(id: string, params: Partial<CategoryEntity>): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
