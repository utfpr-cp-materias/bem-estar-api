import { Request, Response } from 'express';
import { body } from 'express-validator';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendError, sendServerError } from '../utils';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('birthDate')
    .optional()
    .isISO8601().withMessage('Data de nascimento inválida'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('pt-BR').withMessage('Telefone inválido'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória'),
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword')
    .notEmpty().withMessage('Nova senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
];

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, birthDate, phone } = req.body;

      const result = await authService.register({
        name,
        email,
        password,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        phone,
      });

      sendCreated(res, result, 'Cadastro realizado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'E-mail já cadastrado') {
          sendError(res, error.message, 409);
          return;
        }
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      sendSuccess(res, result, 'Login realizado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 401);
        return;
      }
      sendServerError(res);
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = await authService.getProfile(userId);

      sendSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
        return;
      }
      sendServerError(res);
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      sendSuccess(res, null, 'Senha alterada com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }
}

export const authController = new AuthController();
