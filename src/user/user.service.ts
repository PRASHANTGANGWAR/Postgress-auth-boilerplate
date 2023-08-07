import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../models/index';
import { hashPassword } from '../helper/generic';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private user: typeof User) {}
  async create(reqData) {
    const checkUser = await this.user.findAll({
      attributes: ['email'],
      where: {
        email: reqData.email,
      },
    });
    if (checkUser.length) return;
    reqData.password = await hashPassword(reqData.password);
    const data = await this.user.create(reqData);
    return data;
  }

  async findAll() {
    return this.user.findAll();
  }

  async findOne(id: number) {
    return await this.user.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, reqUpdateData) {
    return await this.user.update(reqUpdateData, {
      where: {
        id: id,
      },
    });
  }

  async remove(id: number) {
    return await this.user.destroy({
      where: {
        id: id,
      },
    });
  }
}
