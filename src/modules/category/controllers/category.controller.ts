import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { CategoryService } from '../services/category.service';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  async create(
    @GetUser() user: { id: string },
    @Body(ValidationPipe) body: CreateCategoryDto,
  ) {
    return this.service.create(body, user.id);
  }

  @Get()
  async findAll(@GetUser() user: { id: string }) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.service.findOne(id, user.id);
  }
}
