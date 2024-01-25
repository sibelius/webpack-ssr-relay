const swcConfig = require('./swcrc');

const getLoader = (options = {}) => {
  if (process.env.WP_LOADER === 'swc') {
    // eslint-disable-next-line
    console.log('swc');

    return {
      loader: 'swc-loader',
      options: swcConfig,
    };
  }

  // eslint-disable-next-line
  console.log('babel');

  return {
    loader: 'babel-loader?cacheDirectory',
    options,
  };
};

module.exports.getLoader = getLoader;
