import { Reflector } from '@nestjs/core';

export const KindePermissions = Reflector.createDecorator<string[]>();
