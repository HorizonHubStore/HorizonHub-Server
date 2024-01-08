import express, {Router} from 'express';
import authenticate from '../middleware/auth';
import * as authController from '../controllers/authControllers';

const router: Router = express.Router();


router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/googleLogin', authController.googleLogin);

router.post('/logout', authenticate, authController.logout);

router.post('/refreshToken', authController.refreshToken)


export default router;
