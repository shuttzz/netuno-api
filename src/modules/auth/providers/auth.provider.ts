import { UserRepository } from '../repositories/user.respository';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user.repository';
import { emailKey } from '../../../shared/constants/keys.constants';
import { SESEmailProvider } from '../../../shared/providers/emailProvider/implementations/SESEmailProvider';
import { PasswordRecoveryRepository } from '../repositories/auth.respository';
import { PrismaAuthRepository } from '../repositories/prisma/prisma-auth.repository';

export const authProvider = [
  {
    provide: emailKey,
    useFactory: () => new SESEmailProvider(),
  },
  {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  },
  {
    provide: PasswordRecoveryRepository,
    useClass: PrismaAuthRepository,
  },
];
