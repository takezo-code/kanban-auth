import { TaskStatus } from '../../constants/task-status.constants';

/**
 * DTO para movimentação de task
 */
export interface MoveTaskDTO {
  newStatus: TaskStatus;
}

