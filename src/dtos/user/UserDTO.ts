import { UserRole } from '../../constants/roles.constants';

/**
 * DTO de usuário (sem senha)
 */
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

