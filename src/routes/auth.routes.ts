import { Router } from 'express';
import {
  authController,
  registerValidation,
  loginValidation,
  changePasswordValidation,
} from '../controllers/auth.controller';
import { authMiddleware, validate } from '../middlewares';

const router = Router();

// Rotas públicas
router.post('/register', validate(registerValidation), authController.register.bind(authController));
router.post('/login', validate(loginValidation), authController.login.bind(authController));

// Rotas protegidas
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));
router.put('/change-password', authMiddleware, validate(changePasswordValidation), authController.changePassword.bind(authController));

export default router;
