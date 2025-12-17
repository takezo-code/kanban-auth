import { IAuthRepository } from '../interfaces/repositories/IAuthRepository';
import { AuthRepository } from '../repositories/auth.repository';
import { HashUtil } from '../utils/hash.util';
import { JWTUtil } from '../utils/jwt.util';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../entities/User.entity';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import { LoginDTO } from '../dtos/auth/LoginDTO';
import { AuthResponseDTO, UserDTO } from '../dtos/auth/AuthResponseDTO';
import { JWTPayload } from '../types/auth.types';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { ConflictException } from '../exceptions/ConflictException';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { USER_ROLES } from '../constants/roles.constants';
import { REFRESH_TOKEN_EXPIRES_DAYS } from '../constants/app.constants';

/**
 * Service com toda a lógica de negócio de autenticação
 * Usa Entities, DTOs e Mappers
 */
export class AuthService {
  private authRepository: IAuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  // ==================== REGISTER ====================

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Validar se email já existe
    const existingUser = this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Validar senha
    if (data.password.length < 6) {
      throw new ValidationException('Senha deve ter no mínimo 6 caracteres');
    }

    // Hash da senha
    const passwordHash = await HashUtil.hash(data.password);

    // Criar usuário (role padrão: MEMBER)
    const role = data.role || USER_ROLES.MEMBER;
    const user = this.authRepository.createUser(
      data.name,
      data.email,
      passwordHash,
      role
    );

    // Gerar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salvar refresh token no banco
    await this.saveRefreshToken(refreshToken, user.id);

    return {
      user: UserMapper.toDTO(user),
      accessToken,
      refreshToken,
    };
  }

  // ==================== LOGIN ====================

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    // Buscar usuário
    const user = this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Validar senha
    const isPasswordValid = await HashUtil.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salvar refresh token no banco
    await this.saveRefreshToken(refreshToken, user.id);

    return {
      user: UserMapper.toDTO(user),
      accessToken,
      refreshToken,
    };
  }

  // ==================== REFRESH TOKEN ====================

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verificar se refresh token existe e está válido
    const storedToken = this.authRepository.findRefreshToken(refreshToken);
    
    if (!storedToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (!storedToken.isValid()) {
      throw new UnauthorizedException(
        storedToken.isRevoked() ? 'Refresh token revogado' : 'Refresh token expirado'
      );
    }

    // Verificar JWT
    let payload: JWTPayload;
    try {
      payload = JWTUtil.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Buscar usuário
    const user = this.authRepository.findUserById(payload.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // REFRESH TOKEN ROTATION: Revogar token antigo
    this.authRepository.revokeRefreshToken(refreshToken);

    // Gerar novos tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    // Salvar novo refresh token
    await this.saveRefreshToken(newRefreshToken, user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ==================== LOGOUT ====================

  async logout(refreshToken: string): Promise<void> {
    this.authRepository.revokeRefreshToken(refreshToken);
  }

  // ==================== HELPERS ====================

  private generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return JWTUtil.generateAccessToken(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return JWTUtil.generateRefreshToken(payload);
  }

  private async saveRefreshToken(token: string, userId: number): Promise<void> {
    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    this.authRepository.saveRefreshToken(token, userId, expiresAt);
  }
}
