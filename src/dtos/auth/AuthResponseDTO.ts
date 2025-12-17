import { UserDTO } from '../user/UserDTO';
import { UserRole } from '../../constants/roles.constants';

/**
 * DTO de resposta de autenticação
 */
export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

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

