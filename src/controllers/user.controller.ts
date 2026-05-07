import { Response } from 'express';
import { body } from 'express-validator';
import { userService } from '../services/user.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendError, sendServerError } from '../utils';

export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('birthDate')
    .optional()
    .isISO8601().withMessage('Data de nascimento inválida'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('avatarUrl')
    .optional()
    .isURL().withMessage('URL do avatar inválida'),
];

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.getUser(req.userId!);
      sendSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
        return;
      }
      sendServerError(res);
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, birthDate, phone, avatarUrl } = req.body;

      const user = await userService.updateUser(req.userId!, {
        name,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        phone,
        avatarUrl,
      });

      sendSuccess(res, user, 'Perfil atualizado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await userService.getUserStats(req.userId!);
      sendSuccess(res, stats);
    } catch (error) {
      sendServerError(res);
    }
  }

  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      await userService.deleteUser(req.userId!);
      sendSuccess(res, null, 'Conta desativada com sucesso');
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const userController = new UserController();
