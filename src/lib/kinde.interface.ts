import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Provider,
  Type,
} from '@nestjs/common';

export enum GrantType {
  CLIENT_CREDENTIALS = 'client_credentials',
  AUTHORIZATION_CODE = 'authorization_code',
  PKCE = 'pkce',
}

export interface KindeModuleOptions {
  global?: boolean;
  domain?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  logoutRedirectUri?: string;
  audience?: string;
  grantType?: GrantType;
}

export interface KindeOptionsFactory {
  createKindeOptions(): Promise<KindeModuleOptions> | KindeModuleOptions;
}

export interface KindeModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<KindeOptionsFactory>;
  useClass?: Type<KindeOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<KindeModuleOptions> | KindeModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  extraProviders?: Provider[];
}

export interface KindePayload {
  aud?: string[];
  azp: string;
  billing: Billing;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  scp?: string[];
  sub: string;
  'x-hasura-email'?: string;
  'x-hasura-external-org-id'?: string;
  'x-hasura-org-code'?: string;
  'x-hasura-org-name'?: string;
  'x-hasura-permissions'?: string[];
  'x-hasura-roles'?: HasuraRolesEntity[];
}
export interface Billing {
  has_payment_details: boolean;
  org_entitlements?: null;
  plan: Plan;
}
export interface Plan {
  code?: null;
  created_on?: null;
  has_trial_period?: null;
  invoice_due_on?: null;
  name?: null;
  plan_charge_type?: null;
  trial_expires_on?: null;
}
export interface HasuraRolesEntity {
  id: string;
  key: string;
  name: string;
}

export type IKindeUser = {
  id: string;
  preferred_email: string;
  username: string;
  provided_id: string;
  last_name: string;
  first_name: string;
  picture: string;
};

export type IKindeUser = {
  id: string;
  preferred_email: string;
  username: string;
  provided_id: string;
  last_name: string;
  first_name: string;
  picture: string;
};

export type IKindeRoles = {
  roles: string[];
}

export type IKindUserOrganizations = {
  external_oganization_id: string;
  organization_id: string;
}
