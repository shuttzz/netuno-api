import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidCpfException extends AppException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'CPF Inválido',
      'O CPF informado, é inválido',
    );
  }
}
