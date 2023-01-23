import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class AwsException extends AppException {
  constructor(description: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Houve um erro ao fazer o upload do arquivo',
      description,
    );
  }
}
