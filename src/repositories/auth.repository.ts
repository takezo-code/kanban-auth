import { query } from '../shared/database/postgres.connection';
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { IAuthRepository } from '../interfaces/repositories/IAuthRepository';
import { UserMapper } from '../mappers/user.mapper';

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const result = await query(
      `SELECT 
        id,
        name,
        email,
        password_hash as "passwordHash",
        role,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    return UserMapper.toEntity(result.rows[0]);
  }

  async findUserById(id: number): Promise<User | undefined> {
    const result = await query(
      `SELECT 
        id,
        name,
        email,
        password_hash as "passwordHash",
        role,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    return UserMapper.toEntity(result.rows[0]);
  }

  async createUser(name: string, email: string, passwordHash: string, role: string): Promise<User> {
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, password_hash as "passwordHash", role, created_at as "createdAt", updated_at as "updatedAt"`,
      [name, email, passwordHash, role]
    );

    if (result.rows.length === 0) {
      throw new Error('Falha ao criar usuário');
    }

    return UserMapper.toEntity(result.rows[0]);
  }

  async saveRefreshToken(token: string, userId: number, expiresAt: Date): Promise<RefreshToken> {
    const result = await query(
      `INSERT INTO refresh_tokens (token, user_id, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, token, user_id as "userId", expires_at as "expiresAt", revoked, created_at as "createdAt"`,
      [token, userId, expiresAt]
    );

    const row = result.rows[0];
    return new RefreshToken(
      row.id,
      row.token,
      row.userId,
      row.expiresAt.toISOString(),
      row.revoked ? 1 : 0,
      row.createdAt.toISOString()
    );
  }

  async findRefreshToken(token: string): Promise<RefreshToken | undefined> {
    const result = await query(
      `SELECT 
        id,
        token,
        user_id as "userId",
        expires_at as "expiresAt",
        revoked,
        created_at as "createdAt"
      FROM refresh_tokens
      WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return new RefreshToken(
      row.id,
      row.token,
      row.userId,
      row.expiresAt.toISOString(),
      row.revoked ? 1 : 0,
      row.createdAt.toISOString()
    );
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await query(
      `UPDATE refresh_tokens
       SET revoked = TRUE
       WHERE token = $1`,
      [token]
    );
  }

  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await query(
      `UPDATE refresh_tokens
       SET revoked = TRUE
       WHERE user_id = $1`,
      [userId]
    );
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    await query(
      `DELETE FROM refresh_tokens
       WHERE expires_at < NOW()`
    );
  }
}
