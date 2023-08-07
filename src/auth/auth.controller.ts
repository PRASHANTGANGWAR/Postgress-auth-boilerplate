import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { getResponseMessage, errorResponse, message } from '../helper/index';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(createAuthDto);
      if (data) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.userFound));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.invalidCredentials));
      }
    } catch (error) {}
  }
}
