import { Task } from '../entities/Task.entity';
import { TaskDTO } from '../dtos/task/TaskDTO';

/**
 * Mapper para conversão entre Entity e DTO de Task
 */
export class TaskMapper {
  /**
   * Converte dados do banco para DTO (com informações relacionadas)
   */
  static toDTO(data: {
    id: number;
    title: string;
    description: string | null;
    status: string;
    assignedTo: number | null;
    assignedToName?: string | null;
    createdBy: number;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
  }): TaskDTO {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as any,
      assignedTo: data.assignedTo,
      assignedToName: data.assignedToName,
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Converte dados do banco para Entity
   */
  static toEntity(data: {
    id: number;
    title: string;
    description: string | null;
    status: string;
    assignedTo: number | null;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
  }): Task {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.status as any,
      data.assignedTo,
      data.createdBy,
      data.createdAt,
      data.updatedAt
    );
  }
}

