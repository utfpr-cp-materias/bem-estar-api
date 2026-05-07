import { Router } from 'express';
import { userController, updateUserValidation } from '../controllers/user.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', validate(updateUserValidation), userController.updateProfile.bind(userController));
router.get('/stats', userController.getStats.bind(userController));
router.delete('/account', userController.deleteAccount.bind(userController));

export default router;
