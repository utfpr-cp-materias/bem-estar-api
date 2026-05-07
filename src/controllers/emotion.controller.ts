import { Request, Response } from 'express';
import { body, query } from 'express-validator';
import { emotionService } from '../services/emotion.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendError, sendServerError } from '../utils';

export const recordEmotionValidation = [
  body('emotionId')
    .notEmpty().withMessage('ID da emoção é obrigatório')
    .isUUID().withMessage('ID da emoção inválido'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Intensidade deve ser entre 1 e 10'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notas devem ter no máximo 500 caracteres'),
];

export const recordMultipleEmotionsValidation = [
  body('emotions')
    .isArray({ min: 1 }).withMessage('Emoções são obrigatórias'),
  body('emotions.*.emotionId')
    .notEmpty().withMessage('ID da emoção é obrigatório')
    .isUUID().withMessage('ID da emoção inválido'),
  body('emotions.*.intensity')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Intensidade deve ser entre 1 e 10'),
];

export const dailyCheckInValidation = [
  body('overallMood')
    .notEmpty().withMessage('Humor geral é obrigatório')
    .isInt({ min: 1, max: 10 }).withMessage('Humor deve ser entre 1 e 10'),
  body('energyLevel')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Energia deve ser entre 1 e 10'),
  body('sleepQuality')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Qualidade do sono deve ser entre 1 e 10'),
  body('anxietyLevel')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Nível de ansiedade deve ser entre 1 e 10'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notas devem ter no máximo 1000 caracteres'),
];

export class EmotionController {
  async getAllEmotions(req: Request, res: Response): Promise<void> {
    try {
      const emotions = await emotionService.getAllEmotions();
      sendSuccess(res, emotions);
    } catch (error) {
      sendServerError(res);
    }
  }

  async recordEmotion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { emotionId, intensity, notes } = req.body;
      const record = await emotionService.recordEmotion(req.userId!, {
        emotionId,
        intensity,
        notes,
      });
      sendCreated(res, record, 'Emoção registrada com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async recordMultipleEmotions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { emotions } = req.body;
      const records = await emotionService.recordMultipleEmotions(req.userId!, emotions);
      sendCreated(res, records, 'Emoções registradas com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getEmotionHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { fromDate, toDate, limit } = req.query;
      const history = await emotionService.getUserEmotionHistory(
        req.userId!,
        fromDate ? new Date(fromDate as string) : undefined,
        toDate ? new Date(toDate as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      sendSuccess(res, history);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getEmotionStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const stats = await emotionService.getEmotionStats(req.userId!, days);
      sendSuccess(res, stats);
    } catch (error) {
      sendServerError(res);
    }
  }

  async createDailyCheckIn(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { overallMood, energyLevel, sleepQuality, anxietyLevel, notes } = req.body;
      const result = await emotionService.createDailyCheckIn(req.userId!, {
        overallMood,
        energyLevel,
        sleepQuality,
        anxietyLevel,
        notes,
      });

      const message = result.isNew
        ? 'Check-in criado com sucesso'
        : 'Check-in atualizado com sucesso';

      sendSuccess(res, result.checkIn, message, result.isNew ? 201 : 200);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getTodayCheckIn(req: AuthRequest, res: Response): Promise<void> {
    try {
      const checkIn = await emotionService.getTodayCheckIn(req.userId!);
      sendSuccess(res, checkIn);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getCheckInHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const history = await emotionService.getCheckInHistory(req.userId!, days);
      sendSuccess(res, history);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getCheckInStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const stats = await emotionService.getCheckInStats(req.userId!, days);
      sendSuccess(res, stats);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const emotionController = new EmotionController();
