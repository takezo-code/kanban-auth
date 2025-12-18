import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { ValidationException } from '../exceptions/ValidationException';
import { createTaskSchema, updateTaskSchema, moveTaskSchema } from '../validations/task.validation';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const task = await this.taskService.createTask(validation.data, req.user);

    res.status(201).json({
      status: 'success',
      data: task,
    });
  };

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const tasks = await this.taskService.getAllTasks(req.user);

    res.status(200).json({
      status: 'success',
      data: tasks,
    });
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    const task = await this.taskService.getTaskById(id, req.user);

    res.status(200).json({
      status: 'success',
      data: task,
    });
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const task = await this.taskService.updateTask(id, validation.data as any, req.user);

    res.status(200).json({
      status: 'success',
      data: task,
    });
  };

  moveTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    const validation = moveTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const task = await this.taskService.moveTask(id, validation.data as any, req.user);

    res.status(200).json({
      status: 'success',
      data: task,
    });
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new ValidationException('ID inválido');
    }

    await this.taskService.deleteTask(id, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Task deletada com sucesso',
    });
  };
}
