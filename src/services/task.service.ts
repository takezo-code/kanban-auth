import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { TaskRepository } from '../repositories/task.repository';
import { TaskDTO } from '../dtos/task/TaskDTO';
import { CreateTaskDTO } from '../dtos/task/CreateTaskDTO';
import { UpdateTaskDTO } from '../dtos/task/UpdateTaskDTO';
import { MoveTaskDTO } from '../dtos/task/MoveTaskDTO';
import { JWTPayload } from '../types/auth.types';
import { ForbiddenException } from '../exceptions/ForbiddenException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ValidationException } from '../exceptions/ValidationException';
import { USER_ROLES } from '../constants/roles.constants';
import { ALLOWED_TRANSITIONS, ADMIN_ONLY_TRANSITIONS } from '../constants/task-status.constants';

export class TaskService {
  private taskRepository: ITaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(data: CreateTaskDTO, currentUser: JWTPayload): Promise<TaskDTO> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem criar tasks');
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationException('Título é obrigatório');
    }

    if (data.assignedTo) {
      const userExists = this.taskRepository.userExists(data.assignedTo);
      if (!userExists) {
        throw new NotFoundException('Usuário atribuído não encontrado');
      }
    }

    const task = this.taskRepository.create(
      data.title.trim(),
      data.description?.trim() || null,
      currentUser.userId,
      data.assignedTo || null
    );

    const taskDTO = this.taskRepository.findById(task.id);
    if (!taskDTO) {
      throw new Error('Falha ao buscar task criada');
    }

    return taskDTO;
  }

  async getAllTasks(currentUser: JWTPayload): Promise<TaskDTO[]> {
    if (currentUser.role === USER_ROLES.ADMIN) {
      return this.taskRepository.findAll();
    }
    return this.taskRepository.findByAssignedTo(currentUser.userId);
  }

  async getTaskById(id: number, currentUser: JWTPayload): Promise<TaskDTO> {
    const task = this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (currentUser.role === USER_ROLES.ADMIN) {
      return task;
    }

    if (task.assignedTo !== currentUser.userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return task;
  }

  async updateTask(id: number, data: UpdateTaskDTO, currentUser: JWTPayload): Promise<TaskDTO> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem editar tasks');
    }

    const task = this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (data.assignedTo !== undefined) {
      if (data.assignedTo !== null) {
        const userExists = this.taskRepository.userExists(data.assignedTo);
        if (!userExists) {
          throw new NotFoundException('Usuário atribuído não encontrado');
        }
      }
    }

    this.taskRepository.update(
      id,
      data.title?.trim() || task.title,
      data.description !== undefined ? (data.description?.trim() || null) : task.description,
      data.assignedTo !== undefined ? data.assignedTo : task.assignedTo
    );

    const updatedTask = this.taskRepository.findById(id);
    if (!updatedTask) {
      throw new Error('Falha ao buscar task atualizada');
    }

    return updatedTask;
  }

  async moveTask(id: number, data: MoveTaskDTO, currentUser: JWTPayload): Promise<TaskDTO> {
    const task = this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    const currentStatus = task.status;
    const newStatus = data.newStatus;

    if (currentStatus === newStatus) {
      throw new ValidationException('Task já está neste status');
    }

    const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new ValidationException(
        `Transição inválida: ${currentStatus} → ${newStatus}`
      );
    }

    const isAdminOnlyTransition = ADMIN_ONLY_TRANSITIONS.some(
      ([from, to]) => from === currentStatus && to === newStatus
    );

    if (isAdminOnlyTransition && currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException(
        `Apenas administradores podem fazer a transição ${currentStatus} → ${newStatus}`
      );
    }

    if (currentUser.role === USER_ROLES.MEMBER) {
      if (task.assignedTo !== currentUser.userId) {
        throw new ForbiddenException('Você só pode mover tasks atribuídas a você');
      }
    }

    this.taskRepository.updateStatus(id, newStatus);

    const movedTask = this.taskRepository.findById(id);
    if (!movedTask) {
      throw new Error('Falha ao buscar task movida');
    }

    return movedTask;
  }

  async deleteTask(id: number, currentUser: JWTPayload): Promise<void> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem deletar tasks');
    }

    const task = this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    this.taskRepository.delete(id);
  }
}
