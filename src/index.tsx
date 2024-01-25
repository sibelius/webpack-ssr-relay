import 'isomorphic-fetch';
import { hydrateRoot } from 'react-dom/client';

import MyApp from './pages/_app';
import App from './pages/App';
import { createEnvironment } from './relay/Environment';

const runApp = () => {
  const initialProps = { ...(window.__initialProps__ || {}) };

  delete window.__initialProps__;

  const container = document.getElementById('root');

  if (!container) {
    return null;
  }

  const environment = createEnvironment();

  return hydrateRoot(
    container,
    <MyApp
      Component={App}
      pageProps={initialProps}
      environment={environment}
    />,
    {
      onRecoverableError: (error, args) => {
        // eslint-disable-next-line
        console.log('onRecovarableError', error);
        // eslint-disable-next-line
        console.log('onRecovarableError', args.componentStack);
      },
    },
  );
};

runApp();
