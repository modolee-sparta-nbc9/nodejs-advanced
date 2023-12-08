import { Router } from 'express';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { ProductsController } from '../controllers/products.controller.js';
import { ProductsRepository } from '../repositories/products.repository.js';
import { prisma } from '../utils/prisma/index.js';
import { ProductsService } from '../services/products.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const productsRouter = Router();
const productsRepository = new ProductsRepository(prisma.products);
const productsService = new ProductsService(productsRepository);
const productsController = new ProductsController(productsService);
const usersRepository = new UsersRepository(prisma.users);

productsRouter.post('', needSignin(usersRepository), productsController.createOne); // 생성
productsRouter.get('', productsController.readMany); // 목록 조회
productsRouter.get('/:productId', productsController.readOne); // 상세 조회
productsRouter.put('/:productId', needSignin(usersRepository), productsController.updateOne); // 수정
productsRouter.delete('/:productId', needSignin(usersRepository), productsController.deleteOne); // 삭제

export { productsRouter };
