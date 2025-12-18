import { UserDTO } from '../../dtos/user/UserDTO';

export interface IUserRepository {
  findAll(): Promise<UserDTO[]>;
  findById(id: number): Promise<UserDTO | undefined>;
  update(id: number, name: string, email: string, role: string): Promise<void>;
  delete(id: number): Promise<void>;
  emailExists(email: string, excludeId?: number): Promise<boolean>;
  countAdmins(): Promise<number>;
}
