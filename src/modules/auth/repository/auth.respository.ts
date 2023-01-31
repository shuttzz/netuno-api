import { User } from '@prisma/client';
import { UserEntity } from './user.respository';

export type PasswordRecoveryEntity = {
  id?: string;
  user: User;
  code: string;
  createdAt?: Date;
  expiresIn: Date;
};

export type PasswordRecoveryResponse = {
  code: string;
};

export abstract class PasswordRecoveryRepository {
  abstract create(params: {
    code: string;
    user: UserEntity;
  }): Promise<PasswordRecoveryResponse>;

  abstract findByCode(code: string): Promise<PasswordRecoveryEntity>;

  abstract findByUserId(userId: string): Promise<PasswordRecoveryEntity>;

  abstract deleteResetCodePassword(id: string): Promise<void>;
}
