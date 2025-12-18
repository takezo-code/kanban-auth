import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../shared/middlewares/asyncHandler';
import { authenticate } from '../shared/middlewares/authenticate';
import { authorize } from '../shared/middlewares/authorize';

const router = Router();
const userController = new UserController();

router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuários
 *     description: Apenas ADMIN pode listar todos os usuários.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/',
  authorize(['ADMIN']),
  asyncHandler(userController.getAllUsers)
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Buscar usuário por ID
 *     description: ADMIN pode ver qualquer usuário. Usuários podem ver seus próprios dados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  '/:id',
  asyncHandler(userController.getUserById)
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Atualizar usuário
 *     description: Apenas ADMIN pode atualizar usuários.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       403:
 *         description: Apenas administradores podem atualizar usuários
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: Email já cadastrado
 */
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(userController.updateUser)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Deletar usuário
 *     description: Apenas ADMIN pode deletar usuários. Não é possível deletar a si mesmo ou o último admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Não é possível deletar a si mesmo ou o último admin
 *       403:
 *         description: Apenas administradores podem deletar usuários
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(userController.deleteUser)
);

export { router as userRoutes };
