import * as HttpStatus from '../errors/http-status.error.js';
import { prisma } from '../utils/prisma/index.js';

export class ProductsRepository {
  createOne = async ({ title, description, userId }) => {
    const product = await prisma.products.create({
      data: { title, description, userId },
    });

    return product;
  };

  readMany = async ({ sort }) => {
    const products = await prisma.products.findMany({
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
    const product = await prisma.products.findUnique({
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
    const product = await prisma.products.findUnique({ where: { id } });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const updatedProduct = await prisma.products.update({
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
    const product = await prisma.products.findUnique({ where: { id } });

    if (!product) {
      throw new HttpStatus.NotFound('상품 조회에 실패했습니다.');
    }

    const deletedProduct = await prisma.products.delete({ where: { id } });

    return deletedProduct;
  };
}
