import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Gerar relatórios
router.post('/weekly', reportController.generateWeeklyReport.bind(reportController));
router.post('/monthly', reportController.generateMonthlyReport.bind(reportController));

// Consultar relatórios
router.get('/', reportController.getUserReports.bind(reportController));
router.get('/latest', reportController.getLatestReport.bind(reportController));
router.get('/:reportId', reportController.getReportById.bind(reportController));

export default router;
