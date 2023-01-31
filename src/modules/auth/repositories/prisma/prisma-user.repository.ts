import { PrismaService } from '../../../database/prisma.service';
import { UserEntity, UserRepository, UserResponse } from '../user.respository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async create(params: UserEntity): Promise<UserResponse> {
    return this.prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        password: params.password,
        active: params.active,
        firebaseToken: params.firebaseToken,
        avatarUrl: params.avatarUrl,
        avatarKey: params.avatarKey,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        firebaseToken: true,
        avatarUrl: true,
        avatarKey: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(userEntity: UserEntity): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userEntity.id,
      },
      data: {
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
        active: userEntity.active,
        firebaseToken: userEntity.firebaseToken,
        avatarUrl: userEntity.avatarUrl,
        avatarKey: userEntity.avatarKey,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
