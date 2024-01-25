import { Reflector } from '@nestjs/core';

export const KindeRoles = Reflector.createDecorator<string[]>();
