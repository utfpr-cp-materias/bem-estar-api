import { Router } from 'express';
import { resourceController } from '../controllers/resource.controller';

const router = Router();

// Todas as rotas são públicas (recursos de autoajuda)
router.get('/', resourceController.getAllResources.bind(resourceController));
router.get('/search', resourceController.searchResources.bind(resourceController));
router.get('/emergency', resourceController.getEmergencyContacts.bind(resourceController));
router.get('/:resourceId', resourceController.getResourceById.bind(resourceController));

export default router;
