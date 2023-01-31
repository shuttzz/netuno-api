import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  PasswordRecoveryEntity,
  PasswordRecoveryRepository,
  PasswordRecoveryResponse,
} from '../auth.respository';
import { UserEntity } from '../user.respository';

@Injectable()
export class PrismaAuthRepository implements PasswordRecoveryRepository {
  constructor(private prisma: PrismaService) {}
  async create(params: {
    code: string;
    user: UserEntity;
  }): Promise<PasswordRecoveryResponse> {
    let date = new Date();
    date = new Date(date.setHours(date.getHours() + 2));
    return this.prisma.passwordRecovery.create({
      data: {
        code: params.code.substring(0, 36),
        expiresIn: date,
        user: {
          connect: {
            id: params.user.id,
          },
        },
      },
      select: {
        code: true,
      },
    });
  }

  async findByCode(code: string): Promise<PasswordRecoveryEntity> {
    return this.prisma.passwordRecovery.findFirst({
      where: {
        code,
      },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<PasswordRecoveryEntity> {
    return this.prisma.passwordRecovery.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteResetCodePassword(id: string): Promise<void> {
    await this.prisma.passwordRecovery.delete({
      where: {
        id,
      },
    });
  }
}
