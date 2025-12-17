/**
 * Types compartilhados de autenticação
 * Mantido para compatibilidade com código existente
 * TODO: Migrar para usar entities e DTOs
 */

import { UserRole } from '../constants/roles.constants';

export type { UserRole };

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}
