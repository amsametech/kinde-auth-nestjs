import jwt from 'jsonwebtoken';
import JwksClient from 'jwks-rsa';
import { KindePayload } from '../lib/kinde.interface';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { getEnvSafely } from '../lib/kinde.factory';
import { KINDE_DOMAIN_URL } from '../lib/kinde.constant';

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
   * @param token - The token to be verified.
   * @returns A promise that resolves to the decoded token if verification is successful, or rejects with an error if verification fails.
   */
  protected verifyToken(token?: string): Promise<KindePayload> {
    return new Promise((resolve, reject) => {
      if (!token) return reject(new Error('No JWT token provided!'));
      jwt.verify(token, this.getKey, {}, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as KindePayload);
      });
    });
  }
}
