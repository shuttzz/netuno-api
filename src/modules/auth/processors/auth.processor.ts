import { Process, Processor } from '@nestjs/bull';
import {
  appQueuekey,
  emailKey,
} from '../../../shared/constants/keys.constants';
import { Inject } from '@nestjs/common';
import { IEmailProvider } from '../../../shared/providers/emailProvider/IEmailProvider';
import { processorRecoverPasswordCode } from '../constants/auth.constant';
import { Job } from 'bull';
import { UserEntity } from '../repository/user.respository';
import { resolvePath } from '../../../shared/utils/resolvePath';

export type AuthRecoverPassowrdProcessorType = {
  user: UserEntity;
  recoverCode: number;
};

@Processor(appQueuekey)
export class AuthProcessor {
  constructor(@Inject(emailKey) private emailProvider: IEmailProvider) {}

  @Process({ name: processorRecoverPasswordCode, concurrency: 3 })
  async proccessSendRecoverPassword(
    job: Job<AuthRecoverPassowrdProcessorType>,
  ) {
    const toEmail = [
      { name: job.data.user.name, address: job.data.user.email },
    ];

    await this.emailProvider.sendMail({
      to: toEmail,
      from: {
        name: 'Netuno Mini Gerenciador Financeiro',
        address: process.env.AWS_MAIL_FROM,
      },
      subject: 'Código de recuperação de senha',
      body: {
        file: resolvePath('recover-password.hbs'),
        variables: {
          userName: job.data.user.name,
          code: job.data.recoverCode,
        },
      },
    });
  }
}
