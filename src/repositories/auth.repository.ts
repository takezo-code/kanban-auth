import { getDatabase } from '../shared/database/connection';
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { IAuthRepository } from '../interfaces/repositories/IAuthRepository';
import { UserMapper } from '../mappers/user.mapper';

/**
 * Implementação do Repository de Autenticação
 * Implementa IAuthRepository
 */
export class AuthRepository implements IAuthRepository {
  private db = getDatabase();

  // ==================== USERS ====================

  findUserByEmail(email: string): User | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        email,
        password_hash as passwordHash,
        role,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE email = ?
    `);

    const data = stmt.get(email) as any;
    return data ? UserMapper.toEntity(data) : undefined;
  }

  findUserById(id: number): User | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        email,
        password_hash as passwordHash,
        role,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE id = ?
    `);

    const data = stmt.get(id) as any;
    return data ? UserMapper.toEntity(data) : undefined;
  }

  createUser(name: string, email: string, passwordHash: string, role: string): User {
    const stmt = this.db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, passwordHash, role);
    
    const user = this.findUserById(result.lastInsertRowid as number);
    if (!user) {
      throw new Error('Falha ao criar usuário');
    }

    return user;
  }

  // ==================== REFRESH TOKENS ====================

  saveRefreshToken(token: string, userId: number, expiresAt: Date): RefreshToken {
    const stmt = this.db.prepare(`
      INSERT INTO refresh_tokens (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(token, userId, expiresAt.toISOString());

    return new RefreshToken(
      result.lastInsertRowid as number,
      token,
      userId,
      expiresAt.toISOString(),
      0,
      new Date().toISOString()
    );
  }

  findRefreshToken(token: string): RefreshToken | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        token,
        user_id as userId,
        expires_at as expiresAt,
        revoked,
        created_at as createdAt
      FROM refresh_tokens
      WHERE token = ?
    `);

    const data = stmt.get(token) as any;
    if (!data) return undefined;

    return new RefreshToken(
      data.id,
      data.token,
      data.userId,
      data.expiresAt,
      data.revoked,
      data.createdAt
    );
  }

  revokeRefreshToken(token: string): void {
    const stmt = this.db.prepare(`
      UPDATE refresh_tokens
      SET revoked = 1
      WHERE token = ?
    `);

    stmt.run(token);
  }

  revokeAllUserRefreshTokens(userId: number): void {
    const stmt = this.db.prepare(`
      UPDATE refresh_tokens
      SET revoked = 1
      WHERE user_id = ?
    `);

    stmt.run(userId);
  }

  deleteExpiredRefreshTokens(): void {
    const stmt = this.db.prepare(`
      DELETE FROM refresh_tokens
      WHERE expires_at < datetime('now')
    `);

    stmt.run();
  }
}
