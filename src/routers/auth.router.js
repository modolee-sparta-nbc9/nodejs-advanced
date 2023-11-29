import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signup); // 회원가입
authRouter.post('/signin', authController.signin); // 로그인

export { authRouter };
