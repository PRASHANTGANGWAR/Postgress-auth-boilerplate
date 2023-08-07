import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../models/index';
import { verifyPassword } from '../helper/generic';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private user: typeof User,
    private jwt: JwtService,
  ) {}

  async login(reqData) {
    const { email, password } = reqData;
    const checkUser = await this.user.findAll({
      where: {
        email,
      },
      attributes: ['id', 'email', 'password'],
    });
    if (!checkUser.length) return false;
    const checkPassword = await verifyPassword(password, checkUser[0].password);
    if (email === checkUser[0].email && checkPassword) {
      const token: string = this.jwt.sign({
        id: checkUser[0].id,
      });
      return token;
    }
    return false;
  }
}
