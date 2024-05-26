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
      const token = cookies[KINDE_ACCESS_TOKEN] ?? null;
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const profile = await axios.get(
        `${getEnvSafely(KINDE_DOMAIN_URL)}/oauth2/user_profile`,
        {
          headers,
        },
      );
      if (profile.status === 200) {
        return profile.data;
      }
    } catch (error) {
      throw new Error('Error getting user');
    }
  },
);
