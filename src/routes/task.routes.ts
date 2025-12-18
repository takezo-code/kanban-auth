import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { asyncHandler } from '../shared/middlewares/asyncHandler';
import { authenticate } from '../shared/middlewares/authenticate';
import { authorize } from '../shared/middlewares/authorize';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Criar nova task
 *     description: Apenas ADMIN pode criar tasks. Tasks sempre começam em BACKLOG.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Apenas administradores podem criar tasks
 */
router.post(
  '/',
  authorize(['ADMIN']),
  asyncHandler(taskController.createTask)
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tasks
 *     description: ADMIN vê todas as tasks. MEMBER vê apenas tasks atribuídas a ele.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get(
  '/',
  asyncHandler(taskController.getAllTasks)
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Buscar task por ID
 *     description: ADMIN pode ver qualquer task. MEMBER só pode ver tasks atribuídas a ele.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da task
 *     responses:
 *       200:
 *         description: Task encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Task não encontrada
 */
router.get(
  '/:id',
  asyncHandler(taskController.getTaskById)
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Atualizar task
 *     description: Apenas ADMIN pode editar tasks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task atualizada com sucesso
 *       403:
 *         description: Apenas administradores podem editar tasks
 *       404:
 *         description: Task não encontrada
 */
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(taskController.updateTask)
);

/**
 * @swagger
 * /api/tasks/{id}/move:
 *   patch:
 *     tags: [Tasks]
 *     summary: Mover task entre status
 *     description: |
 *       Regras de movimento:
 *       - MEMBER pode mover: BACKLOG → IN_PROGRESS, IN_PROGRESS → REVIEW
 *       - ADMIN pode mover: REVIEW → DONE, REVIEW → IN_PROGRESS (rejeição)
 *       - MEMBER só pode mover tasks atribuídas a ele
 *       - Não é possível pular etapas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoveTaskRequest'
 *     responses:
 *       200:
 *         description: Task movida com sucesso
 *       400:
 *         description: Transição inválida
 *       403:
 *         description: Acesso negado ou task não atribuída
 *       404:
 *         description: Task não encontrada
 */
router.patch(
  '/:id/move',
  asyncHandler(taskController.moveTask)
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Deletar task
 *     description: Apenas ADMIN pode deletar tasks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da task
 *     responses:
 *       200:
 *         description: Task deletada com sucesso
 *       403:
 *         description: Apenas administradores podem deletar tasks
 *       404:
 *         description: Task não encontrada
 */
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(taskController.deleteTask)
);

export { router as taskRoutes };
