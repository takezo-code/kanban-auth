import { UserRole } from '../../constants/roles.constants';

/**
 * DTO para atualização de usuário
 */
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
}

