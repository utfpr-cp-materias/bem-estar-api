import { Router } from 'express';
import {
  goalController,
  createGoalValidation,
  updateGoalValidation,
  recordProgressValidation,
} from '../controllers/goal.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// CRUD de metas
router.post('/', validate(createGoalValidation), goalController.createGoal.bind(goalController));
router.get('/', goalController.getUserGoals.bind(goalController));
router.get('/today', goalController.getTodayGoals.bind(goalController));
router.get('/stats/:goalId', goalController.getGoalStats.bind(goalController));
router.get('/:goalId', goalController.getGoalById.bind(goalController));
router.put('/:goalId', validate(updateGoalValidation), goalController.updateGoal.bind(goalController));
router.delete('/:goalId', goalController.deleteGoal.bind(goalController));

// Progresso
router.post(
  '/:goalId/progress',
  validate(recordProgressValidation),
  goalController.recordProgress.bind(goalController)
);

export default router;
