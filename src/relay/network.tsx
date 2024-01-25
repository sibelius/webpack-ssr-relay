import type { RequestParameters, Variables, CacheConfig } from 'relay-runtime';
import { Network, QueryResponseCache } from 'relay-runtime';

import { fetchWithRetries } from './fetchWithRetries';
import {
  getHeaders,
  getRequestBody,
  handleData,
  isMutation,
} from './helpers';

import { config } from '../config';

const IS_SERVER = typeof window === typeof undefined;
const CACHE_TTL = 5 * 1000; // 5 seconds, to resolve preloaded results

export function createNetwork() {
  const responseCache = new QueryResponseCache({
    size: 100,
    ttl: CACHE_TTL,
  });

  async function fetchResponse(
    operation: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
  ) {
    const { id, text } = operation;

    const queryID = id || text;

    const isQuery = operation.operationKind === 'query';
    const forceFetch = cacheConfig && cacheConfig.force;

    if (responseCache != null && isQuery && !forceFetch) {
      const fromCache = responseCache.get(queryID, variables);

      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    const result  = await networkFetch(operation, variables);

    if (responseCache != null && isQuery) {
      responseCache.set(queryID, variables, result);
    }

    return result;
  }

  const network = Network.create(fetchResponse);

  // @ts-ignore Private API Hackery? 🤷‍♂️
  network.fetchResponse = fetchResponse;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Private API Hackery? 🤷‍♂️
  network.responseCache = responseCache;

  return network;
}

export async function networkFetch(
  request: RequestParameters,
  variables: Variables,
) {
  const body = getRequestBody(request, variables);
  const headers = {
    ...getHeaders(),
  };

  const isMutationOperation = isMutation(request);

  const fetchFn = isMutationOperation ? fetch : fetchWithRetries;

  const url = IS_SERVER ? config.SERVER_GRAPHQL_URL : config.GRAPHQL_URL;

  try {
    const response = await fetchFn(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body,
      fetchTimeout: 30000,
      retryDelays: [3000, 5000],
    });

    const data = await handleData(response);

    if (isMutationOperation && data.errors) {
      // eslint-disable-next-line
      console.log('throw');
      throw data;
    }

    if (!data.data) {
      throw data.errors;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line
    console.log('err:', err);

    // TODO - handle no successfull response after
    const timeoutRegexp = new RegExp(/Still no successful response after/);
    const serverUnavailableRegexp = new RegExp(/Failed to fetch/);

    if (
      timeoutRegexp.test(err?.message) ||
      serverUnavailableRegexp.test(err?.message)
    ) {
      throw new Error('Unavailable service');
    }

    throw err;
  }
}
