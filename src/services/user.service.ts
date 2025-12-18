import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { UserRepository } from '../repositories/user.repository';
import { UserDTO } from '../dtos/user/UserDTO';
import { UpdateUserDTO } from '../dtos/user/UpdateUserDTO';
import { JWTPayload } from '../types/auth.types';
import { ForbiddenException } from '../exceptions/ForbiddenException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ConflictException } from '../exceptions/ConflictException';
import { ValidationException } from '../exceptions/ValidationException';
import { USER_ROLES } from '../constants/roles.constants';

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(currentUser: JWTPayload): Promise<UserDTO[]> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.userRepository.findAll();
  }

  async getUserById(id: number, currentUser: JWTPayload): Promise<UserDTO> {
    if (currentUser.role !== USER_ROLES.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('Acesso negado');
    }

    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async updateUser(id: number, data: UpdateUserDTO, currentUser: JWTPayload): Promise<UserDTO> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem atualizar usuários');
    }

    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (data.email) {
      const emailExists = this.userRepository.emailExists(data.email, id);
      if (emailExists) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    this.userRepository.update(
      id,
      data.name || user.name,
      data.email || user.email,
      data.role || user.role
    );

    const updatedUser = this.userRepository.findById(id);
    if (!updatedUser) {
      throw new Error('Falha ao buscar usuário atualizado');
    }

    return updatedUser;
  }

  async deleteUser(id: number, currentUser: JWTPayload): Promise<void> {
    if (currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem deletar usuários');
    }

    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.id === currentUser.userId) {
      throw new ValidationException('Você não pode deletar sua própria conta');
    }

    if (user.role === USER_ROLES.ADMIN) {
      const adminCount = this.userRepository.countAdmins();
      if (adminCount <= 1) {
        throw new ValidationException('Não é possível deletar o último administrador');
      }
    }

    this.userRepository.delete(id);
  }
}
