import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import db from '../../models/index.cjs';
import { ProductsController } from '../controllers/products.controller.js';

const productsRouter = Router();
const { Products, Users } = db;

const productsController = new ProductsController();

// 생성
productsRouter.post('', needSignin, productsController.createOne);

// 목록 조회
productsRouter.get('', productsController.readMany);

// 상세 조회
productsRouter.get('/:productId', productsController.readOne);

// 수정
productsRouter.put('/:productId', needSignin, productsController.updateOne);

// 삭제
productsRouter.delete('/:productId', needSignin, productsController.deleteOne);

export { productsRouter };
