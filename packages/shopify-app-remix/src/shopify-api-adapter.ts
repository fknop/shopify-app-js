import type {
  Headers as ShopifyHeaders,
  AdapterArgs,
  NormalizedResponse,
  NormalizedRequest,
} from '@shopify/shopify-api/runtime';
import {
  addHeader,
  canonicalizeHeaders,
  flatHeaders,
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractFetchFunc,
} from '@shopify/shopify-api/runtime';

interface RemixAdapterArgs extends AdapterArgs {
  rawRequest: Request;
}

setAbstractRuntimeString(() => {
  return `Remix`;
});

setAbstractConvertHeadersFunc(
  async (headers: ShopifyHeaders, _adapterArgs: RemixAdapterArgs) => {
    const remixHeaders = new Headers();
    flatHeaders(headers ?? {}).forEach(([key, value]) =>
      remixHeaders.append(key, value),
    );
    return Promise.resolve(remixHeaders);
  },
);

setAbstractConvertRequestFunc(async (adapterArgs: RemixAdapterArgs) => {
  const request = adapterArgs.rawRequest;
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    addHeader(headers, key, value);
  }

  return {
    headers,
    method: request.method ?? 'GET',
    url: new URL(request.url).toString(),
  };
});

setAbstractConvertResponseFunc(
  async (response: NormalizedResponse, _adapterArgs: RemixAdapterArgs) => {
    return new Response(response.body, {
      headers: flatHeaders(response.headers ?? {}),
      status: response.statusCode,
      statusText: response.statusText,
    });
  },
);

setAbstractFetchFunc(
  async ({headers, method, url, body}: NormalizedRequest) => {
    const resp = await fetch(url, {
      method,
      headers: flatHeaders(headers),
      body,
    });
    const respBody = await resp.text();
    return {
      statusCode: resp.status,
      statusText: resp.statusText,
      body: respBody,
      headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
    };
  },
);