import { RegisterRepository } from '../repositoires/register.repository';
import { PrismaRegisterRepository } from '../repositoires/prisma/prisma-register.repository';

export const registerProvider = [
  {
    provide: RegisterRepository,
    useClass: PrismaRegisterRepository,
  },
];
