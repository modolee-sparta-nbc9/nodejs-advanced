import { Router } from 'express';
import { authRouter } from './auth.router.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

export { apiRouter };
