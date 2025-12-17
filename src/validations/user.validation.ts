import { z } from 'zod';
import { USER_ROLE_ARRAY } from '../constants/roles.constants';

/**
 * Schemas de validação usando Zod e Constants
 */

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100).optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(USER_ROLE_ARRAY as [string, ...string[]]).optional(),
});
