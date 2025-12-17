import { AppError } from '../shared/errors/AppError';

/**
 * Exceção para acesso negado
 */
export class ForbiddenException extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
  }
}

