import { Providers } from '../Providers';
import { ReactRelayContainer } from '../relay/ReactRelayContainer';

type AppProps = {
  Component: any;
  pageProps: any;
  environment: any;
};
const MyApp = ({ Component, pageProps, environment }: AppProps) => {
  return (
    <Providers>
      <ReactRelayContainer Component={Component} props={pageProps} environment={environment} />
    </Providers>
  );
};

export default MyApp;
