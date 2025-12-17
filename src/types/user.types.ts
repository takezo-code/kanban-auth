/**
 * Types do módulo de usuários
 */

import { UserRole } from './auth.types';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
}

