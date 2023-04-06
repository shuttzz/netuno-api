import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserResponse } from '../repositories/user.respository';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatar'))
  async create(
    @Body(ValidationPipe) createAuthDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.create(createAuthDto, file);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAll(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatar'))
  @HttpCode(204)
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.userService.update(id, updateAuthDto, file);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
