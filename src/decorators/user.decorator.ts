import * as cookie from 'cookie';
import { IKindeUser } from '../lib/kinde.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getEnvSafely } from '../lib/kinde.factory';
import { KINDE_ACCESS_TOKEN, KINDE_DOMAIN_URL } from '../lib/kinde.constant';
import axios from 'axios';

export const KindeUser = createParamDecorator(
  async (data: keyof IKindeUser, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const cookies = cookie.parse(request.headers.cookie || '');
      let token = cookies[KINDE_ACCESS_TOKEN] ?? '';
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        `${getEnvSafely(KINDE_DOMAIN_URL)}/oauth2/user_profile`,
        {
          headers,
        },
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('Error getting user');
    }
  },
);
