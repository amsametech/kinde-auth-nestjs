import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindePermissions } from '../decorators/permissions.decorator';

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
      const decoded = await this.decodeToken(context);
      const userPermissions = decoded['x-hasura-permissions'];
      if (!userPermissions) {
        throw new UnauthorizedException();
      }
      return permissions.some((permission) =>
        userPermissions.includes(permission),
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
