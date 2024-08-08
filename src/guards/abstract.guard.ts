import jwt from 'jsonwebtoken';
import JwksClient from 'jwks-rsa';
import * as cookie from 'cookie';
import { KindePayload } from '../lib/kinde.interface';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { getEnvSafely } from '../lib/kinde.factory';
import { KINDE_ACCESS_TOKEN, KINDE_DOMAIN_URL } from '../lib/kinde.constant';

type TokenCallback = (err: Error | null, key?: string) => void;

export abstract class AbstractGuard implements CanActivate {
  /**
   * Determines if the user is authorized to access a route.
   * @param context - The execution context of the request.
   * @returns A promise that resolves to a boolean indicating if the user is authorized.
   */
  abstract canActivate(context: ExecutionContext): Promise<boolean>;

  /**
   * Retrieves the signing key from the JwksClient based on the provided header.
   * @param header - The JWT header containing the key ID (kid).
   * @param callback - The callback function to handle the retrieved key.
   */
  private getKey(header: jwt.JwtHeader, callback: TokenCallback) {
    const client = JwksClient({
      jwksUri: `${getEnvSafely(KINDE_DOMAIN_URL)}/.well-known/jwks`,
    });
    client.getSigningKey(header.kid, function (err, key) {
      callback(err, key?.getPublicKey());
    });
  }

  /**
   * Verifies the given token.
   *
   * @param token - The token to be verified.
   * @returns A promise that resolves to the decoded token if verification is successful, or rejects with an error if verification fails.
   */
  private verifyToken(token?: string): Promise<KindePayload> {
    return new Promise((resolve, reject) => {
      if (!token) return reject(new Error('No JWT token provided!'));
      jwt.verify(token, this.getKey, {}, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as KindePayload);
      });
    });
  }

  /**
   * Decodes the token from the request.
   *
   * @param context - The execution context of the request.
   * @returns A promise that resolves to the decoded token.
   */
  protected async decodeToken(
    context: ExecutionContext,
  ): Promise<KindePayload> {
    const request = context.switchToHttp().getRequest();
    const cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies[KINDE_ACCESS_TOKEN] ?? '';
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    const decoded = await this.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }
    return decoded;
  }
}
