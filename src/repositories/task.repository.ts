import { query } from '../shared/database/postgres.connection';
import { Task } from '../entities/Task.entity';
import { TaskDTO } from '../dtos/task/TaskDTO';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { TaskMapper } from '../mappers/task.mapper';

export class TaskRepository implements ITaskRepository {
  async findAll(): Promise<TaskDTO[]> {
    const result = await query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as "assignedTo",
        t.created_by as "createdBy",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        assigned.name as "assignedToName",
        creator.name as "createdByName"
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      ORDER BY t.created_at DESC
    `);

    return result.rows.map((row: any) => TaskMapper.toDTO(row));
  }

  async findById(id: number): Promise<TaskDTO | undefined> {
    const result = await query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as "assignedTo",
        t.created_by as "createdBy",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        assigned.name as "assignedToName",
        creator.name as "createdByName"
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return undefined;
    }

    return TaskMapper.toDTO(result.rows[0]);
  }

  async findByAssignedTo(userId: number): Promise<TaskDTO[]> {
    const result = await query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.assigned_to as "assignedTo",
        t.created_by as "createdBy",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        assigned.name as "assignedToName",
        creator.name as "createdByName"
      FROM tasks t
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.assigned_to = $1
      ORDER BY t.created_at DESC
    `, [userId]);

    return result.rows.map((row: any) => TaskMapper.toDTO(row));
  }

  async create(title: string, description: string | null, createdBy: number, assignedTo: number | null): Promise<Task> {
    const result = await query(`
      INSERT INTO tasks (title, description, created_by, assigned_to, status)
      VALUES ($1, $2, $3, $4, 'BACKLOG')
      RETURNING id
    `, [title, description, createdBy, assignedTo]);

    const taskId = result.rows[0].id;
    const taskDTO = await this.findById(taskId);
    
    if (!taskDTO) {
      throw new Error('Falha ao criar task');
    }

    return TaskMapper.toEntity(taskDTO);
  }

  async update(id: number, title: string, description: string | null, assignedTo: number | null): Promise<void> {
    await query(`
      UPDATE tasks
      SET title = $1, description = $2, assigned_to = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [title, description, assignedTo, id]);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await query(`
      UPDATE tasks
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [status, id]);
  }

  async delete(id: number): Promise<void> {
    await query(`DELETE FROM tasks WHERE id = $1`, [id]);
  }

  async userExists(userId: number): Promise<boolean> {
    const result = await query(`SELECT id FROM users WHERE id = $1`, [userId]);
    return result.rows.length > 0;
  }
}
