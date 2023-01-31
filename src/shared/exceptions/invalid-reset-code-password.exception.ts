import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidResetCodePasswordException extends AppException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'Código Inválido',
      'O Código informado, é inválido',
    );
  }
}
