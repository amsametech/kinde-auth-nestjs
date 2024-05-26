import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindePermissions } from '../decorators/permissions.decorator';
import { KINDE_ACCESS_TOKEN } from '../lib/kinde.constant';

@Injectable()
export class PermissionsGuard extends AbstractGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const permissions = this.reflector.get(
        KindePermissions,
        context.getHandler(),
      );
      if (!permissions) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const cookies = cookie.parse(request.headers.cookie || '');
      const decoded = await this.verifyToken(cookies[KINDE_ACCESS_TOKEN]);
      if (!decoded) {
        throw new UnauthorizedException();
      }
      const userPermissions = decoded['x-hasura-permissions'];
      if (!userPermissions) {
        throw new UnauthorizedException();
      }
      return permissions.some((permission) =>
        userPermissions.includes(permission),
      );
    } catch (error) {
      throw new UnauthorizedException({
        message: error ? String(error) : 'Unauthorized',
      });
    }
  }
}
