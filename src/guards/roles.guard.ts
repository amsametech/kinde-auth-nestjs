import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindeRoles } from '../decorators/roles.decorator';
import { KINDE_ACCESS_TOKEN } from '../lib/kinde.constant';

@Injectable()
export class RolesGuard extends AbstractGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const roles = this.reflector.get(KindeRoles, context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const cookies = cookie.parse(request.headers.cookie || '');
      const decoded = await this.verifyToken(cookies[KINDE_ACCESS_TOKEN]);
      if (!decoded) {
        throw new UnauthorizedException();
      }
      const userRoles = decoded['x-hasura-roles']?.map((role) => role.name);
      if (!userRoles) {
        throw new UnauthorizedException();
      }
      return roles.some((role) => userRoles.includes(role));
    } catch (error) {
      throw new UnauthorizedException({
        message: error ? String(error) : 'Unauthorized',
      });
    }
  }
}
