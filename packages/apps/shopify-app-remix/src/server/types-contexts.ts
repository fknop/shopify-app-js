// This file contains types we want to export to make it easier for apps to pass the contexts we return as types

import type {ShopifyRestResources} from '@shopify/shopify-api';
import type {SessionStorage} from '@shopify/shopify-app-session-storage';

import type {AppConfigArg} from './config-types';
import type {ShopifyApp} from './types';
import type {FutureFlagOptions} from './future/flags';
import type {AdminContext as IAdminContext} from './authenticate/admin/types';
import type {UnauthenticatedAdminContext as IUnauthenticatedAdminContext} from './unauthenticated/admin/types';

type ShopifyConfig<App> =
  App extends ShopifyApp<
    infer Config extends AppConfigArg<
      Config['restResources'] extends ShopifyRestResources
        ? Config['restResources']
        : ShopifyRestResources,
      Config['sessionStorage'] extends SessionStorage
        ? Config['sessionStorage']
        : SessionStorage,
      Config['future'] extends FutureFlagOptions
        ? Config['future']
        : FutureFlagOptions
    >
  >
    ? Config
    : never;

type ConfigComponents<Config> =
  Config extends AppConfigArg<infer Resources, infer Storage, infer Future>
    ? {resources: Resources; storage: Storage; future: Future}
    : never;

type DefaultApp = ShopifyApp<AppConfigArg>;

export type UnauthenticatedAdminContext<App = DefaultApp> =
  IUnauthenticatedAdminContext<
    ConfigComponents<ShopifyConfig<App>>['resources']
  >;

export type AdminContext<App = DefaultApp> = IAdminContext<
  ShopifyConfig<App>,
  ConfigComponents<ShopifyConfig<App>>['resources']
>;
