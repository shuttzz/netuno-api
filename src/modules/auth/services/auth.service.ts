import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';
import { UserRepository, UserResponse } from '../repository/user.respository';
import { compare } from 'bcrypt';
import { InvalidCredentialsException } from '../../../shared/exceptions/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async login(
    credentials: CredentialsDto,
  ): Promise<{ token: string; user: UserResponse }> {
    const user = await this.checkCredentials(credentials);
    const token = this.jwtService.sign(
      { id: user.id },
      { expiresIn: process.env.APP_AUTH_EXPIRES_IN, subject: user.id },
    );

    return { token, user };
  }

  private async checkCredentials(
    credentials: CredentialsDto,
  ): Promise<UserResponse> {
    const { email, password, remember } = credentials;

    const userFind = await this.userRepository.findByEmail(email);

    if (userFind) {
      if (await compare(password, userFind.password)) {
        delete userFind.password;
        return userFind;
      }
    }

    throw new InvalidCredentialsException('Usuário/Senha incorretos');
  }
}
