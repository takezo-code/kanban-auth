import { UserDTO } from '../user/UserDTO';

export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

