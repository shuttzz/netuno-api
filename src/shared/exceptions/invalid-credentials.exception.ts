import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends AppException {
  constructor(description: string) {
    super(HttpStatus.UNAUTHORIZED, 'Usuário não autorizado', description);
  }
}
