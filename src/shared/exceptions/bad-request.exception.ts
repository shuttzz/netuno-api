import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends AppException {
  constructor(description: string) {
    super(HttpStatus.BAD_REQUEST, 'Requisição inválida', description);
  }
}
