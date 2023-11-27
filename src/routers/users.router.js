import { Router } from 'express';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get('/me', needSignin, usersController.readMyInfo);

export { usersRouter };
