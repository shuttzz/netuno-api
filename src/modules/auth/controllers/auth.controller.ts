import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CredentialsDto } from '../dto/credentials.dto';
import { UserResponse } from '../repository/user.respository';
import { RecoverPasswordDto } from '../dto/recover-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) credentials: CredentialsDto,
  ): Promise<{ token: string; user: UserResponse }> {
    return this.authService.login(credentials);
  }

  @Post('/recover-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(
    @Body(ValidationPipe) body: RecoverPasswordDto,
  ): Promise<void> {
    await this.authService.recoverPassword(body);
  }

  @Patch('/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body(ValidationPipe) body: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(body);
  }
}
