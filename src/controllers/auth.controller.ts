import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ValidationException } from '../exceptions/ValidationException';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.validation';

/**
 * Controller de autenticação
 * Usa Exceptions específicas
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    // Validar input
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    // Chamar service
    const result = await this.authService.register(validation.data);

    // Retornar response
    res.status(201).json({
      status: 'success',
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    // Validar input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    // Chamar service
    const result = await this.authService.login(validation.data);

    // Retornar response
    res.status(200).json({
      status: 'success',
      data: result,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    // Validar input
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    // Chamar service
    const result = await this.authService.refreshAccessToken(validation.data.refreshToken);

    // Retornar response
    res.status(200).json({
      status: 'success',
      data: result,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // Validar input
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    // Chamar service
    await this.authService.logout(validation.data.refreshToken);

    // Retornar response
    res.status(200).json({
      status: 'success',
      message: 'Logout realizado com sucesso',
    });
  };
}
