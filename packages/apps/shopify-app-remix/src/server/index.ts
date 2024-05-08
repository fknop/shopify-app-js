import '@shopify/shopify-api/adapters/web-api';
import {setAbstractRuntimeString} from '@shopify/shopify-api/runtime';

setAbstractRuntimeString(() => {
  return `Remix`;
});

export {
  LATEST_API_VERSION,
  LogSeverity,
  DeliveryMethod,
  BillingInterval,
  ApiVersion,
  JwtPayload,
  Session,
} from '@shopify/shopify-api';

export type {ContextTypes} from './types-contexts';
export type {ShopifyApp, LoginError} from './types';
export {LoginErrorType, AppDistribution} from './types';
export {boundary} from './boundary';
export {shopifyApp, appConfig} from './shopify-app';
export * from './errors';
