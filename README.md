<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">
<h1 align="center">Kinde Auth NestJs</h1>

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
  To run this module, you will need to set only one environment variable

```bash
KINDE_DOMAIN_URL=https://<your-subdomain>.kinde.com
```

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
  @KindeRoles(['ADMIN'])
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
  @KindePermissions(['YOUR_PERMISSION_HERE', '...'])
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
  hello(@KindeUser() user: IKindeUser) {
    console.log(user)
      ...
  }
}
```

- ### Graphql Resolver

```ts
  @Query(() => Post)
  async findPostById(
    @Args('id', { type: () => Int }) id: number,
    @KindeUser() user: IKindeUser,
  ) {
    console.log(id, user);
    return ...;
  }
```

kinde supports multi-domain authentication where the primary domain is the same, but there are different NestJs services running in different subdomains.
For example. service1.yourdomain.com, service2.yourdomain.com, so make sure to set this environment in your kinde SDK

```bash
KINDE_COOKIE_DOMAIN=.yourdomain.com
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
