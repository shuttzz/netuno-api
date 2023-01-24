import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class ExistingEntityException extends AppException {
  constructor(description: string) {
    super(HttpStatus.CONFLICT, 'Recurso existente', description);
  }
}
