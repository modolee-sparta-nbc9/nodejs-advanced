import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ProductsRepository } from '../products.repository.js';

describe('Products Unit Tests', () => {
  const mockProductsModel = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const productsRepository = new ProductsRepository(mockProductsModel);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Create One', async () => {
    // GIVEN
    const mockReturnValue = {
      id: 1,
      title: '하리보 골드베렌',
      description:
        '하리보의 대표 제품인 하리보 골드베렌은 쇠고기 젤라틴을 쓰기 때문에 식감이 매우 질기며, 어느 정도는 먹다 보면 턱이 아프다.',
      status: 'FOR_SALE',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    };
    mockProductsModel.create.mockReturnValue(mockReturnValue);

    // WHEN
    const { title, description, userId } = mockReturnValue;
    const product = await productsRepository.createOne({
      title,
      description,
      userId,
    });

    // THEN
    expect(productsRepository.productsModel.create).toHaveBeenCalledTimes(1);
    expect(product).toEqual(mockReturnValue);
  });
});
