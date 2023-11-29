import { ProductsService } from '../services/products.service.js';
import db from '../../models/index.cjs';
import { Sequelize } from 'sequelize';

const { Products, Users } = db;

export class ProductsController {
  constructor() {
    this.productsService = new ProductsService();
  }

  createOne = async (req, res) => {
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

      const data = await this.productsService.createOne({
        title,
        description,
        userId,
        userName,
      });

      return res.status(201).json({
        success: true,
        message: '상품 생성에 성공했습니다.',
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
      });
    }
  };

  readMany = async (req, res) => {
    try {
      const { sort } = req.query;
      let upperCaseSort = sort?.toUpperCase();

      if (upperCaseSort !== 'ASC' && upperCaseSort !== 'DESC') {
        upperCaseSort = 'DESC';
      }

      const data = await this.productsService.readMany({
        sort: upperCaseSort,
      });

      return res.status(200).json({
        success: true,
        message: '상품 목록 조회에 성공했습니다.',
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
      });
    }
  };

  readOne = async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await this.productsService.readOne({ id: productId });

      return res.status(200).json({
        success: true,
        message: '상품 목록 조회에 성공했습니다.',
        data: product,
      });
    } catch (error) {
      console.error(error);

      const statusCode = error.statusCode ?? 500;
      const message =
        error.message ??
        '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.';

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  };

  updateOne = async (req, res) => {
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

      const data = await this.productsService.updateOne({
        userId,
        userName,
        id: productId,
        title,
        description,
        status,
      });

      return res.status(200).json({
        success: true,
        message: '상품 수정에 성공했습니다.',
        data,
      });
    } catch (error) {
      console.error(error);

      const statusCode = error.statusCode ?? 500;
      const message =
        error.message ??
        '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.';

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  };

  deleteOne = async (req, res) => {
    try {
      const { productId } = req.params;
      const { id: userId, name: userName } = res.locals.user;

      const data = await this.productsService.deleteOne({
        userId,
        userName,
        id: productId,
      });

      return res.status(200).json({
        success: true,
        message: '상품 삭제에 성공했습니다.',
        data,
      });
    } catch (error) {
      console.error(error);

      const statusCode = error.statusCode ?? 500;
      const message =
        error.message ??
        '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.';

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  };
}
