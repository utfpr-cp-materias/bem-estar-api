import { Response } from 'express';
import { body, param } from 'express-validator';
import { goalService } from '../services/goal.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendError, sendServerError, sendNotFound } from '../utils';

export const createGoalValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Título é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Título deve ter entre 2 e 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
  body('category')
    .notEmpty().withMessage('Categoria é obrigatória')
    .isIn(['MEDITATION', 'EXERCISE', 'SLEEP', 'SOCIAL', 'MINDFULNESS', 'SELF_CARE', 'THERAPY', 'OTHER'])
    .withMessage('Categoria inválida'),
  body('frequency')
    .notEmpty().withMessage('Frequência é obrigatória')
    .isIn(['DAILY', 'WEEKLY', 'MONTHLY']).withMessage('Frequência inválida'),
  body('targetValue')
    .optional()
    .isInt({ min: 1 }).withMessage('Valor alvo deve ser um número positivo'),
  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Unidade deve ter no máximo 20 caracteres'),
];

export const updateGoalValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Título deve ter entre 2 e 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
  body('category')
    .optional()
    .isIn(['MEDITATION', 'EXERCISE', 'SLEEP', 'SOCIAL', 'MINDFULNESS', 'SELF_CARE', 'THERAPY', 'OTHER'])
    .withMessage('Categoria inválida'),
  body('frequency')
    .optional()
    .isIn(['DAILY', 'WEEKLY', 'MONTHLY']).withMessage('Frequência inválida'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive deve ser boolean'),
];

export const recordProgressValidation = [
  body('completed')
    .notEmpty().withMessage('Status de conclusão é obrigatório')
    .isBoolean().withMessage('completed deve ser boolean'),
  body('value')
    .optional()
    .isInt({ min: 0 }).withMessage('Valor deve ser um número não negativo'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notas devem ter no máximo 500 caracteres'),
  body('date')
    .optional()
    .isISO8601().withMessage('Data inválida'),
];

export class GoalController {
  async createGoal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description, category, frequency, targetValue, unit } = req.body;
      const goal = await goalService.createGoal(req.userId!, {
        title,
        description,
        category,
        frequency,
        targetValue,
        unit,
      });
      sendCreated(res, goal, 'Meta criada com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getUserGoals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly !== 'false';
      const goals = await goalService.getUserGoals(req.userId!, activeOnly);
      sendSuccess(res, goals);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getGoalById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { goalId } = req.params;
      const goal = await goalService.getGoalById(req.userId!, goalId);
      sendSuccess(res, goal);
    } catch (error) {
      if (error instanceof Error) {
        sendNotFound(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async updateGoal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { goalId } = req.params;
      const goal = await goalService.updateGoal(req.userId!, goalId, req.body);
      sendSuccess(res, goal, 'Meta atualizada com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
        return;
      }
      sendServerError(res);
    }
  }

  async deleteGoal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { goalId } = req.params;
      await goalService.deleteGoal(req.userId!, goalId);
      sendSuccess(res, null, 'Meta excluída com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
        return;
      }
      sendServerError(res);
    }
  }

  async recordProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { goalId } = req.params;
      const { completed, value, notes, date } = req.body;
      const progress = await goalService.recordProgress(req.userId!, goalId, {
        completed,
        value,
        notes,
        date: date ? new Date(date) : undefined,
      });
      sendSuccess(res, progress, 'Progresso registrado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
        return;
      }
      sendServerError(res);
    }
  }

  async getTodayGoals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const goals = await goalService.getTodayGoals(req.userId!);
      sendSuccess(res, goals);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getGoalStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { goalId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const stats = await goalService.getGoalStats(
        req.userId!,
        goalId !== 'all' ? goalId : undefined,
        days
      );
      sendSuccess(res, stats);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const goalController = new GoalController();
