import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';

export type IndexHtml = {
  assets: any;
  html: string;
  initialProps: Record<string, unknown>;
};
export const indexHtml = ({
  assets,
  html,
  initialProps,
}: IndexHtml) => {
  const helmet = Helmet.renderStatic();

  return `
    <!doctype html>
      <html lang="">
      <head>
          <meta charset="utf-8" />
          ${helmet.title.toString()}
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${helmet.meta.toString()}
          ${helmet.link.toString()}         
          ${
            assets.main.css
              ? `<link rel="stylesheet" href="${assets.main.css}">`
              : ''
          }
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.main.js}" defer></script>`
              : `<script src="${assets.main.js}" defer crossorigin></script>`
          }
          <style>
            html, body {
              font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              background-color: #f8f8f8;
            }
        </style>
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${html}</div>
        <script>
          window.__initialProps__ = ${serialize(initialProps, {
            isJSON: true,
          })};
        </script>
      </body>
    </html>
  `;
};
