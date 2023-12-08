import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
} from '../constants/security.costant.js';
import * as HttpStatus from '../errors/http-status.error.js';
export class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signup = async ({ email, name, password }) => {
    const existedUser = await this.usersRepository.readOneByEmail(email);

    if (existedUser) {
      throw new HttpStatus.BadRequest('이미 가입 된 이메일입니다.');
    }

    const newUser = await this.usersRepository.createOne({
      email,
      password,
      name,
    });

    return newUser;
  };

  signin = async ({ email, password }) => {
    const user = await this.usersRepository.readOneByEmail(email);
    const hashedPassword = user?.password ?? '';

    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    const isCorrectUser = user && isPasswordMatched;

    if (!isCorrectUser) {
      throw new HttpStatus.Unauthorized('일치하는 인증 정보가 없습니다.');
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  };
}
