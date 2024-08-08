import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractGuard } from './abstract.guard';
import { KindeRoles } from '../decorators/roles.decorator';

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

      const decoded = await this.decodeToken(context);
      const userRoles = decoded['x-hasura-roles']?.map((role) => role.name);
      if (!userRoles) {
        throw new UnauthorizedException();
      }
      return roles.some((role) => userRoles.includes(role));
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
