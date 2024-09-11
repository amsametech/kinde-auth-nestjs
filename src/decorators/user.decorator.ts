import * as cookie from 'cookie';
import { IKindeUser } from '../lib/kinde.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getEnvSafely } from '../lib/kinde.factory';
import { KINDE_ACCESS_TOKEN, KINDE_DOMAIN_URL } from '../lib/kinde.constant';
import axios from 'axios';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const KindeUser = createParamDecorator(
  async (data: keyof IKindeUser, ctx: ExecutionContext) => {
    let request: Request & {
      headers: { cookie: string; authorization: string };
    };
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const graphqlCtx = GqlExecutionContext.create(ctx);
      request = graphqlCtx.getContext().req;
    } else {
      request = ctx.switchToHttp().getRequest();
    }
    if (!request?.headers?.cookie && !request?.headers?.authorization) {
      throw new Error('Expected either a cookie or authorization header');
    }
    const cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies[KINDE_ACCESS_TOKEN] ?? '';
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token) {
      throw new Error('Expected a token in the cookie or authorization header');
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
  },
);
