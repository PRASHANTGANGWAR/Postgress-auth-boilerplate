import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../jwt';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { getResponseMessage, errorResponse, message } from '../helper/index';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger('User');
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userService.create(createUserDto);
      if (Object.keys(data).length) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.createUser));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.userExit));
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('find-all')
  async findAll(@Res() res: Response) {
    try {
      const data = await this.userService.findAll();
      if (data.length) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.userFound));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('')
  async findOne(@Req() req: any, @Res() res: Response) {
    try {
      const data = await this.userService.findOne(req.user.id);
      if (data) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.userFound));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('')
  async update(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.update(req.user.id, updateUserDto);
      if (data.length) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.updateUser));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @UseGuards(JwtGuard)
  @Delete('')
  async remove(@Req() req: any, @Res() res: Response) {
    try {
      const data = await this.userService.remove(req.user.id);
      if (data) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, data, message.deleteUser));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
}
