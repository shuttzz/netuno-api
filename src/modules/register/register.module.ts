import { Module } from '@nestjs/common';
import { RegisterService } from './services/register.service';
import { registerProvider } from './providers/register.provider';
import { RegisterController } from './controllers/register.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../database/prisma.service';
import { UploadService } from '../upload/services/upload.service';
import { CategoryModule } from '../category/category.module';
import { WalletModule } from '../wallet/wallet.module';
import { CategoryService } from '../category/services/category.service';
import { WalletService } from '../wallet/services/wallet.service';

@Module({
  providers: [
    ...registerProvider,
    RegisterService,
    PrismaService,
    UploadService,
    CategoryService,
    WalletService,
  ],
  controllers: [RegisterController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategoryModule,
    WalletModule,
  ],
})
export class RegisterModule {}
