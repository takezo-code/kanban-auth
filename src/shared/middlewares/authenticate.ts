import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../../types/auth.types';
import { JWTUtil } from '../../utils/jwt.util';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const token = parts[1];

    try {
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  } catch (error) {
    next(error);
  }
}
