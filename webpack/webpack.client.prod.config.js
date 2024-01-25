const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const webpackClientCommonConfig = require('./webpack.client.config');

const now = new Date();
const buildDate =
  now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();

module.exports = merge(webpackClientCommonConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: `static/js/${buildDate}/[chunkhash].js`,
    chunkFilename: `static/js/${buildDate}/chunk-[id]-[chunkhash].js`,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
});
