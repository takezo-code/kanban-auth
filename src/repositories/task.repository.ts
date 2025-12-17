import { getDatabase } from '../shared/database/connection';
import { Task } from '../entities/Task.entity';
import { TaskDTO } from '../dtos/task/TaskDTO';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { TaskMapper } from '../mappers/task.mapper';

/**
 * Implementação do Repository de Tasks
 * Implementa ITaskRepository
 */
export class TaskRepository implements ITaskRepository {
  private db = getDatabase();

  findAll(): TaskDTO[] {
    const stmt = this.db.prepare(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as assignedTo,
        t.created_by as createdBy,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        assigned.name as assignedToName,
        creator.name as createdByName
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      ORDER BY t.created_at DESC
    `);

    return stmt.all().map((data: any) => TaskMapper.toDTO(data));
  }

  findById(id: number): TaskDTO | undefined {
    const stmt = this.db.prepare(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as assignedTo,
        t.created_by as createdBy,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        assigned.name as assignedToName,
        creator.name as createdByName
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.id = ?
    `);

    const data = stmt.get(id) as any;
    return data ? TaskMapper.toDTO(data) : undefined;
  }

  findByAssignedTo(userId: number): TaskDTO[] {
    const stmt = this.db.prepare(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as assignedTo,
        t.created_by as createdBy,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        assigned.name as assignedToName,
        creator.name as createdByName
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.assigned_to = ?
      ORDER BY t.created_at DESC
    `);

    return stmt.all(userId).map((data: any) => TaskMapper.toDTO(data));
  }

  create(title: string, description: string | null, createdBy: number, assignedTo: number | null): Task {
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title, description, created_by, assigned_to, status)
      VALUES (?, ?, ?, ?, 'BACKLOG')
    `);

    const result = stmt.run(title, description, createdBy, assignedTo);
    
    const taskDTO = this.findById(result.lastInsertRowid as number);
    if (!taskDTO) {
      throw new Error('Falha ao criar task');
    }

    return TaskMapper.toEntity(taskDTO);
  }

  update(id: number, title: string, description: string | null, assignedTo: number | null): void {
    const stmt = this.db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(title, description, assignedTo, id);
  }

  updateStatus(id: number, status: string): void {
    const stmt = this.db.prepare(`
      UPDATE tasks
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status, id);
  }

  delete(id: number): void {
    const stmt = this.db.prepare(`
      DELETE FROM tasks WHERE id = ?
    `);

    stmt.run(id);
  }

  userExists(userId: number): boolean {
    const stmt = this.db.prepare(`
      SELECT id FROM users WHERE id = ?
    `);

    return stmt.get(userId) !== undefined;
  }
}
