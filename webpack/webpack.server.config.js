const dotEnv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');

const { nodeFallbacks } = require('./nodeFallbacks');
const { getLoader } = require('./getLoader');

const babelConfigServer = require('../babel.server.config');


const cwd = process.cwd();
const outputPath = path.resolve('build-server');

const filename = 'server.js';

// common config
module.exports = {
  context: cwd,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    fallback: {
      ...nodeFallbacks,
    },
    alias: {
      'node-fetch': path.join(
        cwd,
        './node_modules/node-fetch/lib/index.js',
      ),
    },
  },
  entry: {
    server: [path.join(__dirname, '../src/server/index.ts')],
  },
  output: {
    library: 'index',
    libraryTarget: 'commonjs2',
    path: outputPath,
    filename,
    pathinfo: false,
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: [
          getLoader(babelConfigServer),
        ],
        exclude: [
          /node_modules\/(?![debug])/,
          // /node_modules/,
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(jpe?g|png|gif|svg|pdf|csv|xlsx|ttf|woff(2)?)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new dotEnv({
      path: './.env',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
};
