import { CategoryEntity } from '../../category/repositories/category.repository';
import { WalletEntity } from '../../wallet/repositories/wallet.repository';
import { UserEntity } from '../../auth/repositories/user.respository';
import { CreateRegisterDto } from '../dto/create-register.dto';
import { UpdateRegisterDto } from '../dto/update-register.dto';

export type RegisterEntity = {
  id?: string;
  description: string;
  value: number;
  dueDate: Date;
  entry: boolean;
  recurrency: boolean;
  fileUrl?: string;
  fileKey?: string;
  category?: CategoryEntity;
  wallet?: WalletEntity;
  user?: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class RegisterRepository {
  abstract create(
    params: CreateRegisterDto,
    userId: string,
  ): Promise<RegisterEntity>;

  abstract findRecurrent(): Promise<RegisterEntity[]>;

  abstract findOne(id: string, userId: string): Promise<RegisterEntity>;

  abstract findAll(userId: string): Promise<RegisterEntity[]>;

  abstract update(id: string, params: UpdateRegisterDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract generateRecurrency(data: CreateRegisterDto[], ids: string[]);
}
