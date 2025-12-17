import { AppError } from '../shared/errors/AppError';

/**
 * Exceção para não autorizado
 */
export class UnauthorizedException extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
  }
}

