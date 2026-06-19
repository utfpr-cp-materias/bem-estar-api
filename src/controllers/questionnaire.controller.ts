import { Request, Response } from 'express';
import { body } from 'express-validator';
import { questionnaireService } from '../services/questionnaire.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendError, sendServerError } from '../utils';

export const submitAnswersValidation = [
  body('answers')
    .isArray({ min: 1 }).withMessage('Respostas são obrigatórias'),
  body('answers.*.questionId')
    .isString().withMessage('ID da pergunta inválido')
    .trim()
    .notEmpty().withMessage('ID da pergunta é obrigatório'),
  body('answers.*.value')
    .notEmpty().withMessage('Valor da resposta é obrigatório')
    .isInt({ min: 1, max: 10 }).withMessage('Valor deve ser entre 1 e 10'),
];

export class QuestionnaireController {
  async getAllQuestions(req: Request, res: Response): Promise<void> {
    try {
      const questions = await questionnaireService.getAllQuestions();
      sendSuccess(res, questions);
    } catch (error) {
      sendServerError(res);
    }
  }

  async submitAnswers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { answers } = req.body;
      const result = await questionnaireService.submitAnswers(req.userId!, answers);
      sendCreated(res, result, 'Questionário enviado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getUserResponses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { fromDate } = req.query;
      const responses = await questionnaireService.getUserResponses(
        req.userId!,
        fromDate ? new Date(fromDate as string) : undefined
      );
      sendSuccess(res, responses);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const questionnaireController = new QuestionnaireController();
