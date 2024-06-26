import { Provider } from '@nestjs/common';
import { KindeModuleOptions } from './kinde.interface';
import { KINDE_MODULE_OPTIONS } from './kinde.constant';

export function createKindeProvider(options: KindeModuleOptions): Provider[] {
  return [{ provide: KINDE_MODULE_OPTIONS, useValue: options || {} }];
}
export const getEnvSafely = (envKey: string) => {
  const envVal = process.env[envKey];
  if (!envVal) throw new Error(`Missing env variable ${envKey}!`);
  return envVal;
};
