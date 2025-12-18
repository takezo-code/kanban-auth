import { query } from '../shared/database/postgres.connection';
import { UserDTO } from '../dtos/user/UserDTO';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  async findAll(): Promise<UserDTO[]> {
    const result = await query(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `);

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt.toISOString(),
    } as UserDTO));
  }

  async findById(id: number): Promise<UserDTO | undefined> {
    const result = await query(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at as "createdAt"
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async update(id: number, name: string, email: string, role: string): Promise<void> {
    await query(`
      UPDATE users
      SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [name, email, role, id]);
  }

  async delete(id: number): Promise<void> {
    await query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let result;
    
    if (excludeId) {
      result = await query(`SELECT id FROM users WHERE email = $1 AND id != $2`, [email, excludeId]);
    } else {
      result = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    }

    return result.rows.length > 0;
  }

  async countAdmins(): Promise<number> {
    const result = await query(`SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'`);
    return parseInt(result.rows[0].count, 10);
  }
}
