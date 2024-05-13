// This file contains types we want to export to make it easier for apps to pass the contexts we return as types

import type {AppConfigArg} from './config-types';
import type {MandatoryTopics, ShopifyApp} from './types';
import type {AdminContext as IAdminContext} from './authenticate/admin/types';
import type {UnauthenticatedAdminContext as IUnauthenticatedAdminContext} from './unauthenticated/admin/types';
import type {UnauthenticatedStorefrontContext as IUnauthenticatedStorefrontContext} from './unauthenticated/storefront/types';
import type {WebhookContext as IWebhookContext} from './authenticate/webhooks/types';
import type {FlowContext as IFlowContext} from './authenticate/flow/types';
import type {FulfillmentServiceContext as IFulfillmentServiceContext} from './authenticate/fulfillment-service/types';
import type {
  AppProxyContext as IAppProxyContext,
  AppProxyContextWithSession as IAppProxyContextWithSession,
} from './authenticate/public/appProxy/types';
import type {CheckoutContext as ICheckoutContext} from './authenticate/public/checkout/types';
import type {CustomerAccountContext as ICustomerAccountContext} from './authenticate/public/customer-account/types';

type ShopifyConfig<App> =
  App extends ShopifyApp<infer Config extends AppConfigArg> ? Config : never;

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

export type UnauthenticatedStorefrontContext<_App = DefaultApp> =
  IUnauthenticatedStorefrontContext;

export type FlowContext<App = DefaultApp> = IFlowContext<
  ConfigComponents<ShopifyConfig<App>>['resources']
>;

export type FulfillmentServiceContext<App = DefaultApp> =
  IFulfillmentServiceContext<ConfigComponents<ShopifyConfig<App>>['resources']>;

export type AppProxyContext<_App = DefaultApp> =
  | IAppProxyContext
  | IAppProxyContextWithSession;

export type CheckoutContext<_App = DefaultApp> = ICheckoutContext;

export type CustomerAccountContext<_App = DefaultApp> = ICustomerAccountContext;

export type WebhookContext<App = DefaultApp> = IWebhookContext<
  ConfigComponents<ShopifyConfig<App>>['future'],
  ConfigComponents<ShopifyConfig<App>>['resources'],
  keyof ShopifyConfig<App>['webhooks'] | MandatoryTopics
>;
