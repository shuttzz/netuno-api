import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { WalletController } from './controllers/wallet.controller';
import { walletProvider } from './providers/wallet.provider';
import { WalletService } from './services/wallet.service';
import { PrismaService } from '../database/prisma.service';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [WalletController],
  providers: [...walletProvider, WalletService, PrismaService],
  exports: [WalletRepository],
})
export class WalletModule {}