// This file contains types we want to export to make it easier for apps to pass the contexts we return as types

import {
  BillingInterval,
  DeliveryMethod,
  JwtPayload,
  type Session,
} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2023-04';
import {MemorySessionStorage} from '@shopify/shopify-app-session-storage-memory';

import {appConfig, shopifyApp} from './shopify-app';
import {ContextTypes} from './types-contexts';

const MONTHLY_PLAN = 'monthly';

const config = appConfig({
  appUrl: 'https://example.com',
  apiKey: '',
  apiSecretKey: '',
  sessionStorage: new MemorySessionStorage(),
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
  },
  billing: {
    [MONTHLY_PLAN]: {
      lineItems: [
        {
          interval: BillingInterval.Every30Days,
          amount: 5,
          currencyCode: 'USD',
        },
        {
          interval: BillingInterval.Usage,
          amount: 1,
          currencyCode: 'USD',
          terms: '1 dollar per 1000 emails',
        },
      ],
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    v3_lineItemBilling: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
});
const shopify = shopifyApp(config);

type Context = ContextTypes<typeof config>;

async function doStuff(
  session: Session,
  admin: Context['adminApi'],
  storefront: Context['storefrontApi'],
  billing: Context['billing'],
  cors: Context['cors'],
  redirect: Context['redirect'],
  sessionToken: JwtPayload,
  fsPayload: Context['fulfillmentServicePayload'],
  liquid: Context['liquid'],
  topic: Context['webhookTopic'],
) {
  const response = {} as any;

  (await admin.rest.resources.Product.all({session})).data[0].save();

  (await storefront.graphql('')).text();

  await billing.request({plan: MONTHLY_PLAN, amount: 1});

  cors(response).text();

  redirect(response).text();

  console.log(sessionToken);

  console.log(fsPayload.kind, fsPayload.derp);

  liquid('', {headers: {'Content-Type': 'text/html'}}).text();

  switch (topic) {
    case 'APP_UNINSTALLED':
      break;
  }
}

async function loader() {
  const request = {} as any;
  const {admin, session} = await shopify.unauthenticated.admin('');
  const {storefront} = await shopify.unauthenticated.storefront('');
  const {billing, cors, redirect, sessionToken} =
    await shopify.authenticate.admin(request);
  const {payload: fsPayload} =
    await shopify.authenticate.fulfillmentService(request);
  const {admin: admin2, topic} = await shopify.authenticate.webhook(request);
  const {liquid} = await shopify.authenticate.public.appProxy(request);
  await shopify.authenticate.public.checkout(request);

  await doStuff(
    session,
    admin2 || admin,
    storefront,
    billing,
    cors,
    redirect,
    sessionToken,
    fsPayload,
    liquid,
    topic,
  );
}

loader();
