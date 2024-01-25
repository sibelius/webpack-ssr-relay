import { fetchQuery, graphql, usePreloadedQuery } from 'react-relay';

import type { AppQuery } from './__generated__/AppQuery.graphql';
import { getPreloadedQuery } from '../relay/getPreloadedQuery';

export const appQuery = graphql`
  query AppQuery {
    version    
  }
`;

export type AppProps = {
  paymentLinkID: string;
};

const App = (props: AppProps) => {
  const query = usePreloadedQuery<AppQuery>(appQuery, props.queryRefs.appQuery);

  return (
    <span>{query.version}</span>
  );
};

export async function getServerSideProps(ctx, environment) {
  const variables = {
  };

  // force store populate
  await fetchQuery(environment, appQuery, variables).toPromise();

  return {
    props: {
      preloadedQueries: {
        appQuery: await getPreloadedQuery(environment, appQuery, variables),
      },
    },
  };
}

App.getServerSideProps = getServerSideProps;

export default App;
