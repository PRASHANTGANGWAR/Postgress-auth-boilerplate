import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { errorResponse, message } from '../helper/index';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): any | Promise<any> | Observable<any> {
    let res;
    try {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      res = ctx.getResponse();

      const req: Request = ctx.getRequest();

      const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
      }

      const user: any = this.jwt.verify(token);

      if (!user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
      }

      req['user'] = user;

      return true;
    } catch (e) {
      Logger.error(e);
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send(errorResponse(false, message.unauthorizedUser));
    }
  }
}
