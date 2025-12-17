import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../shared/middlewares/asyncHandler';
import { authenticate } from '../shared/middlewares/authenticate';
import { authorize } from '../shared/middlewares/authorize';

/**
 * Rotas de usuários
 * Todas as rotas exigem autenticação e role ADMIN
 */
const router = Router();
const userController = new UserController();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// GET /api/users - Listar usuários (ADMIN only)
router.get(
  '/',
  authorize(['ADMIN']),
  asyncHandler(userController.getAllUsers)
);

// GET /api/users/:id - Buscar usuário por ID
router.get(
  '/:id',
  asyncHandler(userController.getUserById)
);

// PUT /api/users/:id - Atualizar usuário (ADMIN only)
router.put(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(userController.updateUser)
);

// DELETE /api/users/:id - Deletar usuário (ADMIN only)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  asyncHandler(userController.deleteUser)
);

export { router as userRoutes };

