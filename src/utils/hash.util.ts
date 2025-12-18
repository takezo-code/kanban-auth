import bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS } from '../constants/app.constants';

export class HashUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
