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
productsRouter.put('/:productId', async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

// 삭제
productsRouter.delete('/:productId', async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

export { productsRouter };
