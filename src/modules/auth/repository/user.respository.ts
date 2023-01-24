export type UserEntity = {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  avatarKey?: string;
  active: boolean;
  firebaseToken: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserResponse = {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarKey?: string;
  active: boolean;
  firebaseToken: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class UserRepository {
  abstract create(params: UserEntity): Promise<UserResponse>;

  abstract findByEmail(email: string): Promise<UserEntity>;

  abstract findAll(): Promise<UserEntity[]>;

  abstract findOne(id: string): Promise<UserEntity>;

  abstract update(userEntity: UserEntity): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
