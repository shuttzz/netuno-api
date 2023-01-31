import { UserRepository } from '../repository/user.respository';
import { PrismaUserRepository } from '../repository/prisma/prisma-user.repository';
import { emailKey } from '../../../shared/constants/keys.constants';
import { SESEmailProvider } from '../../../shared/providers/emailProvider/implementations/SESEmailProvider';
import { PasswordRecoveryRepository } from '../repository/auth.respository';
import { PrismaAuthRepository } from '../repository/prisma/prisma-auth.repository';

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
