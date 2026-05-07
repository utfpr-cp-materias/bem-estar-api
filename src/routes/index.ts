import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import questionnaireRoutes from './questionnaire.routes';
import emotionRoutes from './emotion.routes';
import goalRoutes from './goal.routes';
import reportRoutes from './report.routes';
import resourceRoutes from './resource.routes';

const router = Router();

// Registrar todas as rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questionnaire', questionnaireRoutes);
router.use('/emotions', emotionRoutes);
router.use('/goals', goalRoutes);
router.use('/reports', reportRoutes);
router.use('/resources', resourceRoutes);

export default router;
