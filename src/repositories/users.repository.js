import bcrypt from 'bcrypt';
import { PASSWORD_HASH_SALT_ROUNDS } from '../constants/security.costant.js';

export class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createOne = async ({ email, password, name }) => {
    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = await this.usersModel.create({
      data: { email, password: hashedPassword, name },
    });

    delete newUser.password;

    return newUser;
  };

  readOneById = async (id) => {
    const user = await this.usersModel.findUnique({ where: { id } });

    return user;
  };

  readOneByEmail = async (email) => {
    const user = await this.usersModel.findUnique({ where: { email } });

    return user;
  };
}
