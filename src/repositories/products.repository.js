import * as HttpStatus from '../errors/http-status.error.js';
import { Sequelize } from 'sequelize';
import db from '../../models/index.cjs';
const { Products, Users } = db;

export class ProductsRepository {
  createOne = async ({ title, description, userId }) => {
    const product = await Products.create({ title, description, userId });
    return product?.toJSON();
  };

  readMany = async ({ sort }) => {
    const products = await Products.findAll({
      attributes: [
        'id',
        'title',
        'description',
        'status',
        'userId',
        [Sequelize.col('user.name'), 'userName'],
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', sort]],
      include: { model: Users, as: 'user', attributes: [] },
    });

    return products.map((product) => product.toJSON());
  };

  readOneById = async (id) => {
    const product = await Products.findByPk(id, {
      attributes: [
        'id',
        'title',
        'description',
        'status',
        'userId',
        [Sequelize.col('user.name'), 'userName'],
        'createdAt',
        'updatedAt',
      ],
      include: { model: Users, as: 'user', attributes: [] },
    });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    return product?.toJSON();
  };

  updateOneById = async (id, { title, description, status }) => {
    const product = await Products.findByPk(id);

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const updatedProduct = await product.update(
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
      { where: { id } },
    );

    return updatedProduct.toJSON();
  };

  deleteOneById = async (id) => {
    const product = await Products.findByPk(id);

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const deletedProduct = await product.destroy({ where: { id } });

    return deletedProduct.toJSON();
  };
}
