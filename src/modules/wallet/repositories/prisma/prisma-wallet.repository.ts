import { Injectable } from '@nestjs/common';
import { WalletEntity, WalletRepository } from '../wallet.repository';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: WalletEntity, userId: string): Promise<WalletEntity> {
    const result = await this.prisma.wallet.create({
      data: {
        name: params.name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (result) {
      return {
        ...result,
        balance: Number(result.balance),
      };
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.wallet.delete({
      where: {
        id,
      },
    });
  }

  async findAll(userId: string): Promise<WalletEntity[]> {
    const results = await this.prisma.wallet.findMany({
      where: {
        userId,
      },
    });

    return results.map((wallet) => ({
      ...wallet,
      balance: Number(wallet.balance),
    }));
  }

  async findByName(name: string, userId: string): Promise<WalletEntity> {
    const result = await this.prisma.wallet.findFirst({
      where: {
        name: {
          mode: 'insensitive',
          equals: name,
        },
        userId,
      },
    });

    if (result) {
      return {
        ...result,
        balance: Number(result.balance),
      };
    }
  }

  async findOne(id: string, userId: string): Promise<WalletEntity> {
    const result = await this.prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (result) {
      return {
        ...result,
        balance: Number(result.balance),
      };
    }
  }

  async update(id: string, params: Partial<WalletEntity>): Promise<void> {
    await this.prisma.wallet.update({
      data: {
        name: params.name,
      },
      where: {
        id,
      },
    });
  }
}
