import { AppError } from '../shared/errors/AppError';

/**
 * Exceção para validação
 */
export class ValidationException extends AppError {
  constructor(message: string = 'Dados inválidos') {
    super(message, 400);
  }
}

