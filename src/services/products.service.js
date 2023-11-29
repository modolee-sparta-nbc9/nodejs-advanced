import { Sequelize } from 'sequelize';
import db from '../../models/index.cjs';
import { ProductsRepository } from '../repositories/products.repository.js';
import * as HttpStatus from '../errors/http-status.error.js';

const { Products, Users } = db;

export class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  createOne = async ({ title, description, userId, userName }) => {
    const product = await this.productsRepository.createOne({
      title,
      description,
      userId,
    });

    return { ...product, userName };
  };

  readMany = async ({ sort }) => {
    const products = await this.productsRepository.readMany({ sort });

    return products;
  };

  readOne = async ({ id }) => {
    const product = await this.productsRepository.readOneById(id);

    return product;
  };

  updateOne = async ({ userId, userName, id, title, description, status }) => {
    // 일치하는 상품이 존재하지 않는 경우
    const product = await this.productsRepository.readOneById(id);

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.userId === userId;
    if (!isProductOwner) {
      throw new HttpStatus.Forbidden('상품 수정 권한이 없습니다.');
    }

    const updatedProduct = await this.productsRepository.updateOneById(id, {
      title,
      description,
      status,
    });

    return { ...updatedProduct, userName };
  };

  deleteOne = async ({ userId, userName, id }) => {
    // 일치하는 상품이 존재하지 않는 경우
    const product = await this.productsRepository.readOneById(id);

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.userId === userId;
    if (!isProductOwner) {
      throw new HttpStatus.Forbidden('상품 삭제 권한이 없습니다.');
    }

    const deletedProduct = await this.productsRepository.deleteOneById(id);

    return { ...deletedProduct, userName };
  };
}
