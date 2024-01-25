import { Module, Provider, DynamicModule } from '@nestjs/common';
import {
  KindeModuleOptions,
  KindeOptionsFactory,
  KindeModuleAsyncOptions,
} from './kinde.interface';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guard';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { createKindeProvider } from './kinde.factory';
import { KINDE_MODULE_OPTIONS } from './kinde.constant';
import { PermissionsGuard } from '../guards/permissions.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IsAuthGuard,
    },
  ],
  controllers: [],
  exports: [],
})
export class KindeModule {
  static register(options: KindeModuleOptions): DynamicModule {
    return {
      module: KindeModule,
      global: options.global,
      providers: createKindeProvider(options),
    };
  }

  static registerAsync(options: KindeModuleAsyncOptions): DynamicModule {
    return {
      module: KindeModule,
      global: options.global,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders ?? []),
      ],
    };
  }

  private static createAsyncProviders(
    options: KindeModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    throw new Error('Invalid KindeModule Async Options');
  }

  private static createAsyncOptionsProvider(
    options: KindeModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: KINDE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    if (options.useExisting) {
      return {
        provide: KINDE_MODULE_OPTIONS,
        useFactory: async (optionsFactory: KindeOptionsFactory) =>
          await optionsFactory.createKindeOptions(),
        inject: [options.useExisting || options.useClass],
      };
    }
    throw new Error('Invalid KindeModule Async Options');
  }
}
