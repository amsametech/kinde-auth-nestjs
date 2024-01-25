import * as cookie from 'cookie';
import { IKindeUser } from '../lib/kinde.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const KindeUser = createParamDecorator(
  (data: keyof IKindeUser, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const cookies = cookie.parse(request.headers.cookie || '');
      if (!cookies['user']) return null;
      const user = JSON.parse(cookies['user']) as IKindeUser;
      return data ? user?.[data] : user;
    } catch (error) {
      throw new Error('Error getting user');
    }
  },
);
