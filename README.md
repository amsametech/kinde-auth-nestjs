<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">
<h1 align="center"> Kinde Auth NestJs</h1>

A NestJs Module to validate your [Kinde](https://kinde.com) JSON Web Tokens

![node-current](https://img.shields.io/node/v/@amsame/kinde-auth-nestjs?style=flat)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![npm version](https://badge.fury.io/js/@amsame%2Fkinde-auth-nestjs.svg)](https://badge.fury.io/js/@amsame%2Fkinde-auth-nestjs)

## Usage

If you are using a mobile or front-end Kinde SDK and want to protect your NestJs back-end APIs, this Module is relevant for you.

- ### Install the module

```bash
npm i @amsame/kinde-auth-nestjs
```

- ### Set the environments
  kinde supports multi-domain authentication where the primary domain is the same, but there are different NestJs services running in different subdomains.
  For example. service1.yourdomain.com, service2.yourdomain.com, so make sure to set this environment in your kinde SDK

```bash
KINDE_COOKIE_DOMAIN=.yourdomain.com
```

To run this module, you will need to add the following environment variables to your NestJs .env file

```bash
KINDE_DOMAIN=https://<your-subdomain>.kinde.com
KINDE_AUDIENCE=https://<your-audience>
```

make sure you set the audience in your kinde SDK, [see here](docs/audience.md)

- ### Load the module

```ts
import { Module } from '@nestjs/common';
import { KindeModule } from '@amsame/kinde-auth-nestjs';

@Module({
  imports: [..., ..., KindeModule],
  controllers: [...],
  providers: [...],
})
export class AppModule {}
```

- ### Protect your endpoints

```ts
import { Controller, Get } from '@nestjs/common';
import { KindeIsAuth } from '@amsame/kinde-auth-nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @KindeIsAuth()
  hello() {
      ...
  }
}
```

- ### Protect by role
  🔴 IMPORTANT
  you must enable [hasura headers](docs/hasura.md)

```ts
import { Controller, Get } from '@nestjs/common';
import { KindeRoles } from '@amsame/kinde-auth-nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @KindeRoles(['admin'])
  hello() {
      ...
  }
}
```

- ### Protect by permissions
  🔴 IMPORTANT
  you must enable [hasura headers](docs/hasura.md)

```ts
import { Controller, Get } from '@nestjs/common';
import { KindePermissions } from '@amsame/kinde-auth-nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @KindePermissions(['...', '...'])
  hello() {
      ...
  }
}
```

- ### Get user details

```ts
import { Controller, Get } from '@nestjs/common';
import { IKindeUser, KindeIsAuth, KindeUser } from '@amsame/kinde-auth-nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @KindeIsAuth()
  hello(@KindeUser() user: IKindeUser) {
      ...
  }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
