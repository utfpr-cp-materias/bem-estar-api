import { Response } from 'express';
import { body } from 'express-validator';
import { supportService } from '../services/support.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendServerError } from '../utils';

export const createTicketValidation = [
  body('message')
    .isString().withMessage('Mensagem inválida')
    .trim()
    .notEmpty().withMessage('Mensagem é obrigatória')
    .isLength({ min: 5, max: 2000 }).withMessage('Mensagem deve ter entre 5 e 2000 caracteres'),
];

export class SupportController {
  async createTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      const ticket = await supportService.createTicket(req.userId!, message);
      sendCreated(res, ticket, 'Mensagem enviada com sucesso');
    } catch (error) {
      sendServerError(res);
    }
  }

  async listMyTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tickets = await supportService.getUserTickets(req.userId!);
      sendSuccess(res, tickets);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const supportController = new SupportController();
