import Router from '@koa/router';
import type { Context, Next } from 'koa';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';
import { Helmet } from 'react-helmet';

import { getAssets } from './getAssets';
import { indexHtml } from './indexHtml';
import { renderApp } from './renderApp';
import MyApp from '../pages/_app';
import App, { getServerSideProps } from '../pages/App';
import { createEnvironment } from '../relay/Environment';

Helmet.canUseDOM = false;
export const isProduction = process.env.NODE_ENV === 'production';

export const assets = getAssets();

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();

router.get('/(.*)', async (ctx: Context, next: Next) => {
  try {
    const environment = createEnvironment();
    const pageProps = await getServerSideProps(ctx, environment);

    if (!pageProps.props) {
      ctx.response.type = 'text';

      ctx.status = 500;

      ctx.body = 'server side error';

      return;
    }

    const { html, err } = await renderApp(
      <MyApp Component={App} pageProps={pageProps.props} environment={environment} />,
      ctx,
      next,
    );

    if (err) {
      ctx.response.type = 'text';

      ctx.status = 500;

      ctx.body = err.stack.toString();

      return;
    }

    const fullHtml = indexHtml({
      assets,
      html,
      initialProps: pageProps.props,
    });

    ctx.status = 200;

    ctx.body = fullHtml;
  } catch (err) {
    // eslint-disable-next-line
    console.log('server error: ', err);

    if ([400, 401, 402, 403, 404].includes(err?.res?.status)) {
      ctx.redirect('/');

      return;
    }

    ctx.response.type = 'text';

    ctx.status = 500;

    ctx.body = err?.stack?.toString();
  }
});

const publicDir = path.join(__dirname, '../public');
const buildDir = path.join(__dirname, '../build');

// Intialize and configure Koa application
const app = new Koa();

app.use(logger());
app.use(
  bodyParser({
    onerror(err, ctx) {
      // http-errors deprecated non-first-argument status code; replace with createError(422, ...)
      // ctx.throw(createHttpError(422, err));
      ctx.throw(err, 422);
    },
  }),
);
// this serve is not working
app.use(
  serve(publicDir, {
    index: false, // index.html does not make sense on server side renderizing
  }),
);
app.use(
  serve(buildDir, {
    index: false,
  }),
);
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
  // eslint-disable-next-line no-console
  console.error('Error while answering request', err);
});

export default app;
