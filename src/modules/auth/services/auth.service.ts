import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';
import { UserRepository, UserResponse } from '../repository/user.respository';
import { compare } from 'bcrypt';
import { InvalidCredentialsException } from '../../../shared/exceptions/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { RecoverPasswordDto } from '../dto/recover-password.dto';
import { InjectQueue } from '@nestjs/bull';
import { appQueuekey } from '../../../shared/constants/keys.constants';
import { Queue } from 'bull';
import { EntityNotFoundException } from '../../../shared/exceptions/entity-not-found.exception';
import { genereteRecoverPasswordCode } from '../../../shared/utils/genereteRecoverPasswordCode.utils';
import { PasswordRecoveryRepository } from '../repository/auth.respository';
import { processorRecoverPasswordCode } from '../constants/auth.constant';
import { jobOptions } from '../../../shared/configs/JobOptions';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { InvalidResetCodePasswordException } from '../../../shared/exceptions/invalid-reset-code-password.exception';
import { InvalidConfirmationPasswordException } from '../../../shared/exceptions/invalid-confirmation-password.exception';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,

    private authRepository: PasswordRecoveryRepository,
    private jwtService: JwtService,
    @InjectQueue(appQueuekey) private appQueue: Queue,
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

  async recoverPassword(body: RecoverPasswordDto): Promise<void> {
    const userFind = await this.userRepository.findByEmail(body.email);
    if (!userFind) {
      throw new EntityNotFoundException(
        'Nenhum usuário foi encontrado para o e-mail informado',
      );
    }

    const existisRecoverCodeForUser = await this.authRepository.findByUserId(
      userFind.id,
    );

    if (existisRecoverCodeForUser) {
      await this.authRepository.deleteResetCodePassword(
        existisRecoverCodeForUser.id,
      );
    }

    /**
     * Generete de Recover Password code
     */
    const codeToRecoverPassword = await genereteRecoverPasswordCode(
      `${userFind.email}${userFind.id}${new Date().getTime()}`,
    );

    const codeToRecoverPasswordMinimal = codeToRecoverPassword.substring(5, 11);

    await this.authRepository.create({
      code: codeToRecoverPasswordMinimal,
      user: userFind,
    });

    await this.appQueue.add(processorRecoverPasswordCode, {
      user: userFind,
      recoverCode: codeToRecoverPasswordMinimal,
      jobOptions,
    });
  }

  async resetPassword(body: ResetPasswordDto): Promise<void> {
    const resetPasswordCodefind = await this.authRepository.findByCode(
      body.code,
    );

    if (!resetPasswordCodefind) {
      throw new InvalidResetCodePasswordException();
    }

    const userFind = await this.userRepository.findOne(
      resetPasswordCodefind.user.id,
    );

    if (!userFind) {
      throw new EntityNotFoundException(
        'Não existe mais usuário vinculado a esse código',
      );
    }

    if (
      body.password !== undefined &&
      body.password !== body.passwordConfirmation
    ) {
      throw new InvalidConfirmationPasswordException('As senhas não conferem');
    } else if (
      body.password !== undefined &&
      body.password === body.passwordConfirmation
    ) {
      userFind.password = await hash(body.password, 8);
    }

    await this.userRepository.update(userFind);

    await this.authRepository.deleteResetCodePassword(resetPasswordCodefind.id);
  }
}
