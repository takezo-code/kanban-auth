import { AppError } from '../shared/errors/AppError';

/**
 * Exceção para recurso não encontrado
 */
export class NotFoundException extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
  }
}

