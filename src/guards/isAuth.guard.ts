import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindeIsAuth } from '../decorators/auth.decorator';
import { KINDE_ACCESS_TOKEN } from '../lib/kinde.constant';

@Injectable()
export class IsAuthGuard extends AbstractGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const auth = this.reflector.get(KindeIsAuth, context.getHandler());
      if (!auth) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const cookies = cookie.parse(request.headers.cookie || '');
      const decoded = await this.verifyToken(cookies[KINDE_ACCESS_TOKEN]);
      if (!decoded) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: error ? String(error) : 'Unauthorized',
      });
    }
  }
}
