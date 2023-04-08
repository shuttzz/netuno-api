import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { PassportModule } from '@nestjs/passport';
import { categoryProvider } from './providers/category.provider';
import { PrismaService } from '../database/prisma.service';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CategoryController],
  providers: [...categoryProvider, CategoryService, PrismaService],
  exports: [CategoryRepository],
})
export class CategoryModule {}
