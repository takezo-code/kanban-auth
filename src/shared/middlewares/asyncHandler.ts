import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper para handlers assíncronos
 * Captura erros de promises e passa para o errorHandler
 * 
 * Uso:
 * router.post('/login', asyncHandler(authController.login))
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

