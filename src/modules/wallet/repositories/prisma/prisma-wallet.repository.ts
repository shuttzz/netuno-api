import { Injectable } from '@nestjs/common';
import { WalletEntity, WalletRepository } from '../wallet.repository';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: WalletEntity, userId: string): Promise<WalletEntity> {
    return this.prisma.wallet.create({
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
    await this.prisma.wallet.delete({
      where: {
        id,
      },
    });
  }

  async findAll(userId: string): Promise<WalletEntity[]> {
    return this.prisma.wallet.findMany({
      where: {
        userId,
      },
    });
  }

  async findByName(name: string, userId: string): Promise<WalletEntity> {
    return this.prisma.wallet.findFirst({
      where: {
        name: {
          mode: 'insensitive',
          equals: name,
        },
        userId,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<WalletEntity> {
    return this.prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
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
