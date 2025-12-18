import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ValidationException } from '../exceptions/ValidationException';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.validation';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const result = await this.authService.register(validation.data);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const result = await this.authService.login(validation.data);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    const result = await this.authService.refreshAccessToken(validation.data.refreshToken);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationException(validation.error.errors[0].message);
    }

    await this.authService.logout(validation.data.refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Logout realizado com sucesso',
    });
  };
}
