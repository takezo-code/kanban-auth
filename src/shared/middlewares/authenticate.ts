import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../../types/auth.types';
import { JWTUtil } from '../../utils/jwt.util';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException';

/**
 * Estende o tipo Request do Express para incluir user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware de autenticação
 * Valida o JWT Access Token e adiciona user ao request
 * 
 * Uso:
 * router.get('/protected', authenticate, controller.method)
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const token = parts[1];

    // Verificar e decodificar token
    try {
      const payload = JWTUtil.verifyAccessToken(token);
      
      // Adicionar user ao request
      req.user = payload;
      
      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  } catch (error) {
    next(error);
  }
}

