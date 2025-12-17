import { UserDTO } from '../../dtos/user/UserDTO';

/**
 * Interface do Repository de Usuários
 */
export interface IUserRepository {
  findAll(): UserDTO[];
  findById(id: number): UserDTO | undefined;
  update(id: number, name: string, email: string, role: string): void;
  delete(id: number): void;
  emailExists(email: string, excludeId?: number): boolean;
  countAdmins(): number;
}

