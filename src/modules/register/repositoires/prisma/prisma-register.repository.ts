import { Injectable } from '@nestjs/common';
import { RegisterEntity, RegisterRepository } from '../register.repository';
import { PrismaService } from '../../../database/prisma.service';
import { CreateRegisterDto } from '../../dto/create-register.dto';
import { UpdateRegisterDto } from '../../dto/update-register.dto';

@Injectable()
export class PrismaRegisterRepository implements RegisterRepository {
  constructor(private prisma: PrismaService) {}
  async create(
    params: CreateRegisterDto,
    userId: string,
  ): Promise<RegisterEntity> {
    const result = await this.prisma.register.create({
      data: {
        description: params.description,
        value: params.value,
        recurrency: params.recurrency || false,
        entry: params.entry || false,
        dueDate: params.dueDate,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        wallet: {
          connect: {
            id: params.walletId,
          },
        },
        category: {
          connect: {
            id: params.categoryId,
          },
        },
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
        value: Number(result.value),
      };
    }

    return null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.register.delete({
      where: {
        id,
      },
    });
  }

  async findAll(userId: string): Promise<RegisterEntity[]> {
    const results = await this.prisma.register.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return results.map((register) => ({
      ...register,
      value: Number(register.value),
    }));
  }

  async findOne(id: string, userId: string): Promise<RegisterEntity> {
    const result = await this.prisma.register.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        wallet: true,
        category: true,
      },
    });

    if (result) {
      return {
        ...result,
        value: Number(result.value),
      };
    }

    return null;
  }

  async findRecurrent(userId: string): Promise<RegisterEntity[]> {
    const results = await this.prisma.register.findMany({
      where: {
        user: {
          id: userId,
        },
        recurrency: true,
      },
    });

    return results.map((register) => ({
      ...register,
      value: Number(register.value),
    }));
  }

  async update(id: string, params: UpdateRegisterDto): Promise<void> {
    await this.prisma.register.update({
      where: {
        id,
      },
      data: {
        description: params.description,
        value: params.value,
        recurrency: params.recurrency,
        entry: params.entry,
        dueDate: params.dueDate,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        wallet: {
          connect: {
            id: params.walletId,
          },
        },
        category: {
          connect: {
            id: params.categoryId,
          },
        },
      },
    });
  }
}
