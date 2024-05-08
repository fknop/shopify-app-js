// This file contains types we want to export to make it easier for apps to pass the contexts we return as types

import type {ShopifyRestResources} from '@shopify/shopify-api';
import {SessionStorage} from '@shopify/shopify-app-session-storage';

import type {AdminApiContext, StorefrontContext} from './clients';
import type {AppConfigArg} from './config-types';
import type {BillingContext} from './authenticate/admin/billing/types';
import type {EnsureCORSFunction} from './authenticate/helpers';
import type {RedirectFunction} from './authenticate/admin/helpers';
import type {FulfillmentServicePayload} from './authenticate/fulfillment-service/types';
import type {LiquidResponseFunction} from './authenticate/public/appProxy/types';
import type {MandatoryTopics} from './types';
import {FutureFlagOptions} from './future/flags';

export interface ContextTypes<
  Config extends AppConfigArg<Resources, Storage, Future>,
  Resources extends
    ShopifyRestResources = Config['restResources'] extends ShopifyRestResources
    ? Config['restResources']
    : ShopifyRestResources,
  Storage extends SessionStorage = Config['sessionStorage'],
  Future extends FutureFlagOptions = Config['future'],
> {
  adminApi: AdminApiContext<
    Config['restResources'] extends ShopifyRestResources
      ? Config['restResources']
      : ShopifyRestResources
  >;

  storefrontApi: StorefrontContext;

  billing: BillingContext<Config>;

  cors: EnsureCORSFunction;

  redirect: RedirectFunction;

  fulfillmentServicePayload: FulfillmentServicePayload;

  liquid: LiquidResponseFunction;

  webhookTopic: keyof Config['webhooks'] | MandatoryTopics;
}
