import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { UserRole } from '../../constants/roles.constants';

/**
 * Middleware de autorização por role
 * Verifica se o usuário tem uma das roles permitidas
 * 
 * IMPORTANTE: Deve ser usado DEPOIS do middleware authenticate
 * 
 * Uso:
 * router.post('/admin-only', authenticate, authorize(['ADMIN']), controller.method)
 * router.get('/any-authenticated', authenticate, authorize(['ADMIN', 'MEMBER']), controller.method)
 */
export function authorize(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Verificar se usuário está autenticado
      if (!req.user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      // Verificar se tem role permitida
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenException('Acesso negado');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

