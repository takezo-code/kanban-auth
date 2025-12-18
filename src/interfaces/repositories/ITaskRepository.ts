import { Task } from '../../entities/Task.entity';
import { TaskDTO } from '../../dtos/task/TaskDTO';

export interface ITaskRepository {
  findAll(): Promise<TaskDTO[]>;
  findById(id: number): Promise<TaskDTO | undefined>;
  findByAssignedTo(userId: number): Promise<TaskDTO[]>;
  create(title: string, description: string | null, createdBy: number, assignedTo: number | null): Promise<Task>;
  update(id: number, title: string, description: string | null, assignedTo: number | null): Promise<void>;
  updateStatus(id: number, status: string): Promise<void>;
  delete(id: number): Promise<void>;
  userExists(userId: number): Promise<boolean>;
}
