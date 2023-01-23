import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../database/prisma.service';
import { authProvider } from './providers/auth.provider';
import { UploadService } from '../upload/services/upload.service';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    ...authProvider,
    AuthService,
    UserService,
    PrismaService,
    UploadService,
  ],
  imports: [],
})
export class AuthModule {}
