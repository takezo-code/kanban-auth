import { getDatabase } from '../shared/database/connection';
import { UserDTO } from '../dtos/user/UserDTO';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

/**
 * Implementação do Repository de Usuários
 * Implementa IUserRepository
 */
export class UserRepository implements IUserRepository {
  private db = getDatabase();

  findAll(): UserDTO[] {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at as createdAt
      FROM users
      ORDER BY created_at DESC
    `);

    return stmt.all() as UserDTO[];
  }

  findById(id: number): UserDTO | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at as createdAt
      FROM users
      WHERE id = ?
    `);

    return stmt.get(id) as UserDTO | undefined;
  }

  update(id: number, name: string, email: string, role: string): void {
    const stmt = this.db.prepare(`
      UPDATE users
      SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, email, role, id);
  }

  delete(id: number): void {
    const stmt = this.db.prepare(`
      DELETE FROM users WHERE id = ?
    `);

    stmt.run(id);
  }

  emailExists(email: string, excludeId?: number): boolean {
    let stmt;
    let result;

    if (excludeId) {
      stmt = this.db.prepare(`
        SELECT id FROM users WHERE email = ? AND id != ?
      `);
      result = stmt.get(email, excludeId);
    } else {
      stmt = this.db.prepare(`
        SELECT id FROM users WHERE email = ?
      `);
      result = stmt.get(email);
    }

    return result !== undefined;
  }

  countAdmins(): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'
    `);

    const result = stmt.get() as { count: number };
    return result.count;
  }
}
