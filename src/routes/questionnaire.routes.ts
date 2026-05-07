import { Router } from 'express';
import {
  questionnaireController,
  submitAnswersValidation,
} from '../controllers/questionnaire.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Rota pública - lista de perguntas
router.get('/questions', questionnaireController.getAllQuestions.bind(questionnaireController));

// Rotas protegidas
router.post(
  '/submit',
  authMiddleware,
  validate(submitAnswersValidation),
  questionnaireController.submitAnswers.bind(questionnaireController)
);

router.get(
  '/responses',
  authMiddleware,
  questionnaireController.getUserResponses.bind(questionnaireController)
);

export default router;
