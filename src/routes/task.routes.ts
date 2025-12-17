import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { asyncHandler } from '../shared/middlewares/asyncHandler';
import { authenticate } from '../shared/middlewares/authenticate';
import { authorize } from '../shared/middlewares/authorize';

/**
 * Rotas de tasks
 * Todas as rotas exigem autenticação
 * Algumas rotas exigem role ADMIN
 */
const router = Router();
const taskController = new TaskController();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// POST /api/tasks - Criar task (ADMIN only)
router.post(
  '/',
  authorize(['ADMIN']),
  asyncHandler(taskController.createTask)
);

// GET /api/tasks - Listar tasks (todos autenticados)
router.get(
  '/',
  asyncHandler(taskController.getAllTasks)
);

// GET /api/tasks/:id - Buscar task por ID (todos autenticados)
router.get(
  '/:id',
  asyncHandler(taskController.getTaskById)
);

// PUT /api/tasks/:id - Atualizar task (ADMIN only)
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(taskController.updateTask)
);

// PATCH /api/tasks/:id/move - Mover task (regras no service)
router.patch(
  '/:id/move',
  asyncHandler(taskController.moveTask)
);

// DELETE /api/tasks/:id - Deletar task (ADMIN only)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(taskController.deleteTask)
);

export { router as taskRoutes };

