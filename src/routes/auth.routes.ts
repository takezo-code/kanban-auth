import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../shared/middlewares/asyncHandler';
import { authRateLimiter } from '../shared/middlewares/rateLimit';

/**
 * Rotas de autenticação
 * Todas as rotas são públicas, exceto onde especificado
 */
const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Criar conta
router.post('/register', asyncHandler(authController.register));

// POST /api/auth/login - Login (com rate limit)
router.post('/login', authRateLimiter, asyncHandler(authController.login));

// POST /api/auth/refresh - Renovar access token
router.post('/refresh', asyncHandler(authController.refresh));

// POST /api/auth/logout - Logout (revogar refresh token)
router.post('/logout', asyncHandler(authController.logout));

export { router as authRoutes };

