import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends AppException {
  constructor(description: string) {
    super(HttpStatus.BAD_REQUEST, 'Dados inválidos', description);
  }
}
