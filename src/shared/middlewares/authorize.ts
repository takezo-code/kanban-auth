import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { UserRole } from '../../constants/roles.constants';

export function authorize(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenException('Acesso negado');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
