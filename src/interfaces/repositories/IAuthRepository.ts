import { User } from '../../entities/User.entity';
import { RefreshToken } from '../../entities/RefreshToken.entity';

/**
 * Interface do Repository de Autenticação
 * Define o contrato que qualquer implementação deve seguir
 */
export interface IAuthRepository {
  findUserByEmail(email: string): User | undefined;
  findUserById(id: number): User | undefined;
  createUser(name: string, email: string, passwordHash: string, role: string): User;
  saveRefreshToken(token: string, userId: number, expiresAt: Date): RefreshToken;
  findRefreshToken(token: string): RefreshToken | undefined;
  revokeRefreshToken(token: string): void;
  revokeAllUserRefreshTokens(userId: number): void;
  deleteExpiredRefreshTokens(): void;
}

