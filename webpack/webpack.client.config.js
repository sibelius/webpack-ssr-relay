const AssetsPlugin = require('assets-webpack-plugin');
const dotEnv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { nodeFallbacks } = require('./nodeFallbacks');
const { getLoader } = require('./getLoader');

const cwd = process.cwd();
const appBuild = 'build';
const outputPath = path.join(cwd, appBuild);

module.exports = {
  context: path.resolve(cwd, './'),
  entry: [path.join(__dirname, '../src/index.tsx')],
  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'main.js', // improve this
    pathinfo: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    fallback: {
      ...nodeFallbacks,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          getLoader(),
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|pdf|csv|xlsx|ttf|woff(2)?)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new dotEnv({
      path: './.env',
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    new WebpackManifestPlugin({
      fileName: 'chunks.json',
    }),
    // Output our JS and CSS files in a manifest file called assets.json
    new AssetsPlugin({
      path: outputPath,
      filename: 'assets.json',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};
