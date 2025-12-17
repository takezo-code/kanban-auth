import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { BaseException } from '../../exceptions/BaseException';

/**
 * Middleware global de tratamento de erros
 * Deve ser o ÚLTIMO middleware registrado no Express
 * 
 * Suporta:
 * - BaseException (novas exceptions específicas)
 * - AppError (legacy, mantido por compatibilidade)
 * - Erros genéricos
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Se for uma BaseException (novo padrão)
  if (error instanceof BaseException) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.code,
    });
    return;
  }

  // Se for um AppError (legacy)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // Se for erro desconhecido (não operacional), loga e retorna 500
  console.error('❌ Erro não tratado:', error);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}

