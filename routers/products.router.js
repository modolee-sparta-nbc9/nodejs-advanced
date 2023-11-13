import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import db from '../models/index.cjs';

const productsRouter = Router();
const { Products, Users } = db;

// 생성
productsRouter.post('', needSignin, async (req, res) => {
  try {
    const { id: userId, name: userName } = res.locals.user;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: '제목 입력이 필요합니다.',
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: '설명 입력이 필요합니다.',
      });
    }

    const product = (
      await Products.create({ title, description, userId })
    ).toJSON();

    return res.status(201).json({
      success: true,
      message: '상품 생성에 성공했습니다.',
      data: { ...product, userName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

// 목록 조회
productsRouter.get('', async (req, res) => {
  try {
    const { sort } = req.query;
    let upperCaseSort = sort?.toUpperCase();

    if (upperCaseSort !== 'ASC' && upperCaseSort !== 'DESC') {
      upperCaseSort = 'DESC';
    }

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
      order: [['createdAt', upperCaseSort]],
      include: { model: Users, as: 'user', attributes: [] },
    });

    return res.status(200).json({
      success: true,
      message: '상품 목록 조회에 성공했습니다.',
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

// 상세 조회
productsRouter.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findByPk(productId, {
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

    return res.status(200).json({
      success: true,
      message: '상품 목록 조회에 성공했습니다.',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

// 수정
productsRouter.put('/:productId', needSignin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, status } = req.body;
    const { id: userId, name: userName } = res.locals.user;

    // 수정 정보가 하나도 없는 경우
    if (!title && !description && !status) {
      return res.status(400).json({
        success: false,
        message: '수정 정보는 최소 한 가지 이상이어야 합니다.',
      });
    }

    const isValidStatus = status
      ? status === 'FOR_SALE' || status === 'SOLD_OUT'
      : true;

    if (!isValidStatus) {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 상태입니다. (status: FOR_SALE | SOLD_OUT)',
      });
    }

    // 일치하는 상품이 존재하지 않는 경우
    const product = await Products.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품 조회에 실패했습니다.',
      });
    }

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.userId === userId;
    if (!isProductOwner) {
      return res.status(403).json({
        success: false,
        message: '상품 수정 권한이 없습니다.',
      });
    }

    await product.update(
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
      { where: { id: productId } },
    );

    const updatedProduct = {
      ...product.toJSON(),
      userName,
    };

    return res.status(200).json({
      success: true,
      message: '상품 수정에 성공했습니다.',
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

// 삭제
productsRouter.delete('/:productId', needSignin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId, name: userName } = res.locals.user;

    // 일치하는 상품이 존재하지 않는 경우
    const product = await Products.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품 조회에 실패했습니다.',
      });
    }

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.userId === userId;
    if (!isProductOwner) {
      return res.status(403).json({
        success: false,
        message: '상품 삭제 권한이 없습니다.',
      });
    }

    await product.destroy({ where: { id: productId } });

    const deletedProduct = {
      ...product.toJSON(),
      userName,
    };

    return res.status(200).json({
      success: true,
      message: '상품 삭제에 성공했습니다.',
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

export { productsRouter };
