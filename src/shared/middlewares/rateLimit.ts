import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Rate limiter para rotas de autenticação
 * Previne ataques de força bruta
 * 
 * Configuração padrão: 5 requisições a cada 15 minutos
 */
export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  message: {
    status: 'error',
    message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

