import { TaskStatus } from '../../constants/task-status.constants';

/**
 * DTO de task (com informações relacionadas)
 */
export interface TaskDTO {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedTo: number | null;
  assignedToName?: string | null;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

