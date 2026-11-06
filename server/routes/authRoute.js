import express from 'express';
import { registerController, loginController } from '../controllers/authController.js';
import {
  getMeController,
  updateMeController,
  changePasswordController,
} from '../controllers/meController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register',         registerController);
router.post('/login',            loginController);
router.get( '/me',         auth, getMeController);
router.put( '/me',         auth, updateMeController);
router.put( '/change-password', auth, changePasswordController);

export default router;
