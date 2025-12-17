import { AppError } from '../shared/errors/AppError';

/**
 * Exceção para conflito (ex: email já cadastrado)
 */
export class ConflictException extends AppError {
  constructor(message: string = 'Conflito de dados') {
    super(message, 409);
  }
}

