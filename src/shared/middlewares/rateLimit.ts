import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

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
