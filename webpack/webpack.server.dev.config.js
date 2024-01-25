const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { ReloadServerPlugin } = require('./ReloadServerPlugin');

const webpackServerCommonConfig = require('./webpack.server.config');

const filename = 'server.js';
const appBuild = 'build-server';

module.exports = merge(webpackServerCommonConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReloadServerPlugin({
      script: path.resolve(appBuild, filename),
    }),
    new ReactRefreshPlugin(),
  ],
  externals: {
    'node-html-to-image': 'node-html-to-image',
    'react-pdf': 'react-pdf',
  },
  output: {
    hashFunction: 'xxhash64',
    hashDigestLength: 16,
  },
  module: {
    unsafeCache: true,
  },
  experiments: {
    cacheUnaffected: true,
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    compression: 'gzip',
    hashAlgorithm: 'xxhash64',
  },
  stats: {
    warnings: false,
  },
});
