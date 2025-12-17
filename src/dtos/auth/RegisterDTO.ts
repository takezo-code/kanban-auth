import { UserRole } from '../../constants/roles.constants';

/**
 * DTO para registro de usuário
 */
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

