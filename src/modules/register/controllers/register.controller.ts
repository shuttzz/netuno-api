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
import { AuthGuard } from '@nestjs/passport';
import { RegisterService } from '../services/register.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRegisterDto } from '../dto/create-register.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UpdateRegisterDto } from '../dto/update-register.dto';

@Controller('registers')
@UseGuards(AuthGuard())
export class RegisterController {
  constructor(private readonly service: RegisterService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('fileRegister'))
  async create(
    @Body(ValidationPipe) body: CreateRegisterDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: { id: string },
  ) {
    return this.service.create(body, file, user.id);
  }

  @Get()
  async findAll(@GetUser() user: { id: string }) {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.service.findOne(id, user.id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('fileRegister'))
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @GetUser() user: { id: string },
    @Body(ValidationPipe) body: UpdateRegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.service.update(id, body, user.id, file);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @GetUser() user: { id: string }) {
    await this.service.delete(id, user.id);
  }
}
