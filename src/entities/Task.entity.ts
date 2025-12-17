/**
 * Entidade de Domínio: Task
 * Representa o modelo de domínio da task
 */
import { TaskStatus } from '../constants/task-status.constants';

export class Task {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string | null,
    public readonly status: TaskStatus,
    public readonly assignedTo: number | null,
    public readonly createdBy: number,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  /**
   * Regra de domínio: Verifica se está atribuída a um usuário
   */
  isAssignedTo(userId: number): boolean {
    return this.assignedTo === userId;
  }

  /**
   * Regra de domínio: Verifica se está em status final
   */
  isDone(): boolean {
    return this.status === 'DONE';
  }
}

