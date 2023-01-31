import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Post()
  async create(
    @GetUser() user: { id: string },
    @Body(ValidationPipe) body: CreateWalletDto,
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

  @Put(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @GetUser() user: { id: string },
    @Body() body: UpdateWalletDto,
  ) {
    await this.service.update(id, body, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @GetUser() user: { id: string }) {
    await this.service.delete(id, user.id);
  }
}
