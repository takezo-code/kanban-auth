import { Task } from '../../entities/Task.entity';
import { TaskDTO } from '../../dtos/task/TaskDTO';

/**
 * Interface do Repository de Tasks
 */
export interface ITaskRepository {
  findAll(): TaskDTO[];
  findById(id: number): TaskDTO | undefined;
  findByAssignedTo(userId: number): TaskDTO[];
  create(title: string, description: string | null, createdBy: number, assignedTo: number | null): Task;
  update(id: number, title: string, description: string | null, assignedTo: number | null): void;
  updateStatus(id: number, status: string): void;
  delete(id: number): void;
  userExists(userId: number): boolean;
}

