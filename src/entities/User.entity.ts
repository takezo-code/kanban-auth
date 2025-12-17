/**
 * Entidade de Domínio: User
 * Representa o modelo de domínio do usuário
 * Contém apenas dados e regras de domínio
 */
export type UserRole = 'ADMIN' | 'MEMBER';

export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  /**
   * Regra de domínio: Verifica se é admin
   */
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  /**
   * Regra de domínio: Verifica se é member
   */
  isMember(): boolean {
    return this.role === 'MEMBER';
  }
}

