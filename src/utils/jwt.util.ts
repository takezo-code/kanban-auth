import jwt from 'jsonwebtoken';
import { env } from '../shared/config/env';
import { JWTPayload } from '../types/auth.types';

export class JWTUtil {
  static generateAccessToken(payload: JWTPayload): string {
    // @ts-expect-error - jsonwebtoken types issue with expiresIn
    return jwt.sign(payload, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiresIn,
    });
  }

  static generateRefreshToken(payload: JWTPayload): string {
    // @ts-expect-error - jsonwebtoken types issue with expiresIn
    return jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    });
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, env.jwtAccessSecret) as JWTPayload;
  }

  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, env.jwtRefreshSecret) as JWTPayload;
  }
}
