import { Router } from 'express';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { ProductsController } from '../controllers/products.controller.js';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('', needSignin, productsController.createOne); // 생성
productsRouter.get('', productsController.readMany); // 목록 조회
productsRouter.get('/:productId', productsController.readOne); // 상세 조회
productsRouter.put('/:productId', needSignin, productsController.updateOne); // 수정
productsRouter.delete('/:productId', needSignin, productsController.deleteOne); // 삭제

export { productsRouter };
