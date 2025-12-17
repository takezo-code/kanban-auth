import { User } from '../entities/User.entity';
import { UserDTO } from '../dtos/user/UserDTO';

/**
 * Mapper para conversão entre Entity e DTO de User
 */
export class UserMapper {
  /**
   * Converte Entity para DTO (remove informações sensíveis)
   */
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Converte dados do banco para Entity
   */
  static toEntity(data: {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.passwordHash,
      data.role as any,
      data.createdAt,
      data.updatedAt
    );
  }
}

