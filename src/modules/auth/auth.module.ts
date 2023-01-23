import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../database/prisma.service';
import { authProvider } from './providers/auth.provider';
import { UploadService } from '../upload/services/upload.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    ...authProvider,
    AuthService,
    UserService,
    PrismaService,
    UploadService,
    JwtStrategy,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('APP_AUTH_SECRET'),
          signOptions: { expiresIn: config.get('APP_AUTH_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
