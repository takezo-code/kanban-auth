import bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS } from '../constants/app.constants';

/**
 * Utilitários para hash de senhas
 * Usa constants centralizadas
 */
export class HashUtil {
  /**
   * Gera hash da senha
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  /**
   * Compara senha com hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
