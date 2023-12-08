import * as HttpStatus from '../errors/http-status.error.js';

export class ProductsRepository {
  constructor(productsModel) {
    this.productsModel = productsModel;
  }

  createOne = async ({ title, description, userId }) => {
    const product = await this.productsModel.create({
      data: { title, description, userId },
    });

    return product;
  };

  readMany = async ({ sort }) => {
    const products = await this.productsModel.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: sort.toLowerCase(),
      },
    });

    return products.map((product) => {
      const userName = product.user.name;
      delete product.user;
      return {
        ...product,
        userName,
      };
    });
  };

  readOneById = async (id) => {
    const product = await this.productsModel.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const userName = product.user.name;
    delete product.user;
    return {
      ...product,
      userName,
    };
  };

  updateOneById = async (id, { title, description, status }) => {
    const product = await this.productsModel.findUnique({ where: { id } });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const updatedProduct = await this.productsModel.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    return updatedProduct;
  };

  deleteOneById = async (id) => {
    const product = await this.productsModel.findUnique({ where: { id } });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const deletedProduct = await this.productsModel.delete({ where: { id } });

    return deletedProduct;
  };
}
