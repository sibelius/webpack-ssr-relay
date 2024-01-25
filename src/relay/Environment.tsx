import { Environment, RecordSource, Store } from 'relay-runtime';

import { createNetwork } from './network';

const source = new RecordSource();
const store = new Store(source, {
  // This property tells Relay to not immediately clear its cache when the user
  // navigates around the app. Relay will hold onto the specified number of
  // query results, allowing the user to return to recently visited pages
  // and reusing cached data if its available/fresh.
  gcReleaseBufferSize: 10,
});

const IS_SERVER = typeof window === typeof undefined;
const CLIENT_DEBUG = false;
const SERVER_DEBUG = false;

export function createEnvironment() {
  const network = createNetwork();
  const environment = new Environment({
    network,
    store,
    isServer: IS_SERVER,
    log(event) {
      const showLog = (IS_SERVER && SERVER_DEBUG) || (!IS_SERVER && CLIENT_DEBUG);

      if (showLog) {
        // eslint-disable-next-line
        console.debug('[relay environment event]', event);
      }
    },
  });

  // @ts-ignore Private API Hackery? 🤷‍♂️
  environment.getNetwork().responseCache = network.responseCache;
  environment.getNetwork().fetchResponse = network.fetchResponse;

  return environment;
}
