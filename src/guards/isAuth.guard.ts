import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindeIsAuth } from '../decorators/auth.decorator';

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
      return !!(await this.decodeToken(context));
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
