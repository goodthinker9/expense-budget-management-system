import express from 'express';
import { registerController, loginController } from '../controllers/authController.js';
import {
  getMeController,
  updateMeController,
  changePasswordController,
} from '../controllers/meController.js';
import auth                                               from '../middleware/auth.js';
import { loginLimiter, registerLimiter, passwordLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register',        registerLimiter,              registerController);
router.post('/login',           loginLimiter,                 loginController);
router.get( '/me',        auth,                               getMeController);
router.put( '/me',        auth,                               updateMeController);
router.put( '/change-password', auth, passwordLimiter,        changePasswordController);

export default router;
