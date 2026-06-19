import { Router } from 'express';
import {
  supportController,
  createTicketValidation,
} from '../controllers/support.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Todas as rotas exigem autenticação
router.post(
  '/',
  authMiddleware,
  validate(createTicketValidation),
  supportController.createTicket.bind(supportController)
);
router.get('/', authMiddleware, supportController.listMyTickets.bind(supportController));

export default router;
