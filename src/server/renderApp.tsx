import type { Context, Next } from 'koa';
import type { ReactElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

import { WritableAsPromise } from './WritableAsPromise';

const ABORT_DELAY = 10000;

// not ready yet
export const renderToPipeableStreamPromise = async (
  tree: ReactElement,
  ctx: Context,
  next: Next,
) => {
  const writableStream = new WritableAsPromise();

  let didError = false;

  const { pipe, abort } = renderToPipeableStream(tree, {
    onError(error) {
      writableStream._destroy(error);
      abort();
      ctx.status = 500;
      // eslint-disable-next-line no-console
      console.error(error);
    },
    onShellReady() {
      ctx.status = didError ? 500 : 200;
      ctx.set('Content-Type', 'text/html');
      writableStream._write(ctx.body ?? '', undefined, next);
      pipe(writableStream);
    },
    onShellError(error) {
      writableStream._destroy(error, next);
      abort();
      didError = true;
      ctx.set('Content-Type', 'text/html');
      ctx.body = '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>';
    },
  });

  setTimeout(() => {
    writableStream.destroy();
    abort();
  }, ABORT_DELAY);

  return await writableStream;
};

export type RenderAppOutput = {
  html?: string | null;
  styledComponentStyleTags?: string;
  muiStyleTags?: string;
  err?: Error;
};
export const renderApp = async (
  tree: ReactElement,
  ctx: Context,
  next: Next,
): Promise<RenderAppOutput> => {
  try {
    const html = await renderToPipeableStreamPromise(
      tree,
      ctx,
      next,
    );

    return {
      html,
    };
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);

    return {
      err,
    };
  }
};
