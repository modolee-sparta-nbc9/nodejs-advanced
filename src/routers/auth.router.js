import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { prisma } from '../utils/prisma/index.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { AuthService } from '../services/auth.service.js';

const authRouter = Router();
const usersRepository = new UsersRepository(prisma.users);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

authRouter.post('/signup', authController.signup); // 회원가입
authRouter.post('/signin', authController.signin); // 로그인

export { authRouter };
