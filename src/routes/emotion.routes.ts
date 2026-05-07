import { Router } from 'express';
import {
  emotionController,
  recordEmotionValidation,
  recordMultipleEmotionsValidation,
  dailyCheckInValidation,
} from '../controllers/emotion.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Rota pública - lista de emoções disponíveis
router.get('/list', emotionController.getAllEmotions.bind(emotionController));

// Rotas protegidas
router.use(authMiddleware);

// Registro de emoções
router.post(
  '/record',
  validate(recordEmotionValidation),
  emotionController.recordEmotion.bind(emotionController)
);

router.post(
  '/record-multiple',
  validate(recordMultipleEmotionsValidation),
  emotionController.recordMultipleEmotions.bind(emotionController)
);

router.get('/history', emotionController.getEmotionHistory.bind(emotionController));
router.get('/stats', emotionController.getEmotionStats.bind(emotionController));

// Check-in diário
router.post(
  '/checkin',
  validate(dailyCheckInValidation),
  emotionController.createDailyCheckIn.bind(emotionController)
);

router.get('/checkin/today', emotionController.getTodayCheckIn.bind(emotionController));
router.get('/checkin/history', emotionController.getCheckInHistory.bind(emotionController));
router.get('/checkin/stats', emotionController.getCheckInStats.bind(emotionController));

export default router;
