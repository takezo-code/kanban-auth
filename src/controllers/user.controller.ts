import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { ValidationException } from '../exceptions/ValidationException';
import { updateUserSchema } from '../validations/user.validation';

/**
 * Controller de usuários
 * Usa Exceptions específicas
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users - Listar usuários (ADMIN only)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const users = await this.userService.getAllUsers(req.user);

    res.status(200).json({
      status: 'success',
      data: users,
    });
  };

  // GET /api/users/:id - Buscar usuário por ID
  getUserById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    const user = await this.userService.getUserById(id, req.user);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  };

  // PUT /api/users/:id - Atualizar usuário (ADMIN only)
  updateUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const user = await this.userService.updateUser(id, validation.data, req.user);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  };

  // DELETE /api/users/:id - Deletar usuário (ADMIN only)
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    await this.userService.deleteUser(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Usuário deletado com sucesso',
    });
  };
}
