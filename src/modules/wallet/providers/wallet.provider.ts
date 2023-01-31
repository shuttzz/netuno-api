import { WalletRepository } from '../repositories/wallet.repository';
import { PrismaWalletRepository } from '../repositories/prisma/prisma-wallet.repository';

export const walletProvider = [
  {
    provide: WalletRepository,
    useClass: PrismaWalletRepository,
  },
];
