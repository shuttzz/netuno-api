import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class EntityNotFoundException extends AppException {
  constructor(description: string) {
    super(HttpStatus.NOT_FOUND, 'Recurso não encontrado', description);
  }
}
