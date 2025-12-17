/**
 * Entidade de Domínio: RefreshToken
 */
export class RefreshToken {
  constructor(
    public readonly id: number,
    public readonly token: string,
    public readonly userId: number,
    public readonly expiresAt: string,
    public readonly revoked: number, // SQLite boolean (0 ou 1)
    public readonly createdAt: string
  ) {}

  /**
   * Regra de domínio: Verifica se está revogado
   */
  isRevoked(): boolean {
    return this.revoked === 1;
  }

  /**
   * Regra de domínio: Verifica se está expirado
   */
  isExpired(): boolean {
    return new Date(this.expiresAt) < new Date();
  }

  /**
   * Regra de domínio: Verifica se é válido
   */
  isValid(): boolean {
    return !this.isRevoked() && !this.isExpired();
  }
}

