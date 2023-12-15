import express from 'express';
import { Router } from 'express';
import authenticate from '../middleware/auth';
import * as authController from '../controllers/auth_controllers';

const router: Router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/dashboard', authenticate, authController.dashboard);

export default router;
