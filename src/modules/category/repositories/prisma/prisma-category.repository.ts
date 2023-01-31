import { Injectable } from '@nestjs/common';
import { CategoryRepository, CategoryEntity } from '../category.repository';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}
  async create(params: CategoryEntity, userId): Promise<CategoryEntity> {
    return this.prisma.category.create({
      data: {
        name: params.name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async findAll(userId: string): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  async findByName(name: string, userId: string): Promise<CategoryEntity> {
    return this.prisma.category.findFirst({
      where: {
        name: {
          mode: 'insensitive',
          equals: name,
        },
        userId,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<CategoryEntity> {
    return this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: string, params: CategoryEntity): Promise<void> {
    await this.prisma.category.update({
      data: {
        name: params.name,
      },
      where: {
        id,
      },
    });
  }
}
