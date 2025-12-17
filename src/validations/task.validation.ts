import { z } from 'zod';
import { TASK_STATUS_ARRAY } from '../constants/task-status.constants';

/**
 * Schemas de validação usando Zod e Constants
 */

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(200),
  description: z.string().max(1000).optional(),
  assignedTo: z.number().int().positive().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  assignedTo: z.number().int().positive().optional().nullable(),
});

export const moveTaskSchema = z.object({
  newStatus: z.enum(TASK_STATUS_ARRAY as [string, ...string[]]),
});
