import { User } from '../../entities/User.entity';
import { RefreshToken } from '../../entities/RefreshToken.entity';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserById(id: number): Promise<User | undefined>;
  createUser(name: string, email: string, passwordHash: string, role: string): Promise<User>;
  saveRefreshToken(token: string, userId: number, expiresAt: Date): Promise<RefreshToken>;
  findRefreshToken(token: string): Promise<RefreshToken | undefined>;
  revokeRefreshToken(token: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: number): Promise<void>;
  deleteExpiredRefreshTokens(): Promise<void>;
}
