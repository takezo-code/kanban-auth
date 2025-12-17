/**
 * Types e interfaces de tasks
 */

export type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedTo: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface CreateTaskDTO {
  title: string;
  description?: string;
  assignedTo?: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  assignedTo?: number;
}

export interface MoveTaskDTO {
  newStatus: TaskStatus;
}

/**
 * Mapa de transições permitidas
 * Define quais movimentações são válidas no fluxo
 */
export const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  BACKLOG: ['IN_PROGRESS'],
  IN_PROGRESS: ['REVIEW', 'BACKLOG'],
  REVIEW: ['DONE', 'IN_PROGRESS'],
  DONE: [], // DONE é final, não pode mover
};

/**
 * Transições que apenas ADMIN pode fazer
 */
export const ADMIN_ONLY_TRANSITIONS: Array<[TaskStatus, TaskStatus]> = [
  ['REVIEW', 'DONE'],       // Apenas ADMIN aprova
  ['REVIEW', 'IN_PROGRESS'], // Apenas ADMIN rejeita
  ['IN_PROGRESS', 'BACKLOG'], // Apenas ADMIN volta para backlog
];

