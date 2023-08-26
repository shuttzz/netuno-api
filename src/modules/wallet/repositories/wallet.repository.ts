import { User } from '@prisma/client';

export type WalletEntity = {
  id?: string;
  name: string;
  balance: number;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class WalletRepository {
  abstract create(params: WalletEntity, userId: string): Promise<WalletEntity>;

  abstract findByName(name: string, userId: string): Promise<WalletEntity>;

  abstract findOne(id: string, userId: string): Promise<WalletEntity>;

  abstract findAll(userId: string): Promise<WalletEntity[]>;

  abstract update(id: string, params: Partial<WalletEntity>): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
