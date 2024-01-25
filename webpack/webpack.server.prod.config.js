const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const webpackServerCommonConfig = require('./webpack.server.config');

module.exports = merge(webpackServerCommonConfig, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
  externals: {
    // do not bundle to enable instrumentation
    'elastic-apm-node': 'commonjs elastic-apm-node',
    '@koa/router': '@koa/router',
    'node-html-to-image': 'node-html-to-image',
    'react-pdf': 'react-pdf',
  },
});
