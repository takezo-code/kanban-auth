/**
 * DTO para criação de task
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  assignedTo?: number;
}

