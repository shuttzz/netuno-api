import { CategoryRepository } from '../repositories/category.repository';
import { PrismaCategoryRepository } from '../repositories/prisma/prisma-category.repository';

export const categoryProvider = [
  {
    provide: CategoryRepository,
    useClass: PrismaCategoryRepository,
  },
];
