const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const webpackClientCommonConfig = require('./webpack.client.config');

const PORT = parseInt(process.env.PORT || '8777', 10);
const cwd = process.cwd();
const outputPath = path.join(cwd, 'build');

module.exports = merge(webpackClientCommonConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshPlugin()],
  devServer: {
    static: {
      directory: outputPath,
    },
    allowedHosts: 'all',
    historyApiFallback: { disableDotRule: true },
    hot: true,
    port: PORT,
    compress: true,
    liveReload: false,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  module: {
    unsafeCache: true,
  },
  experiments: {
    cacheUnaffected: true,
  },
  output: {
    hashFunction: 'xxhash64',
    hashDigestLength: 16,
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    memoryCacheUnaffected: true,
    compression: 'gzip',
    hashAlgorithm: 'xxhash64',
  },
  stats: {
    warnings: false,
  },
});
