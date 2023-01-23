import { UserRepository } from '../repository/user.respository';
import { PrismaUserRepository } from '../repository/prisma/prisma-user.repository';

export const authProvider = [
  {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  },
];
