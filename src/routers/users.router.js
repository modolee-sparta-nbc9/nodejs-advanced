import { Router } from 'express';
import { prisma } from '../utils/prisma/index.js';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
import { UsersRepository } from '../repositories/users.repository.js';
const usersRouter = Router();

const usersController = new UsersController();
const usersRepository = new UsersRepository(prisma.users);

usersRouter.get('/me', needSignin(usersRepository), usersController.readMyInfo); // 내 정보 조회

export { usersRouter };
