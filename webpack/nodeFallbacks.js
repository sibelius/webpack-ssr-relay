module.exports = {
  path: require.resolve('path-browserify'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('crypto-browserify'),
  zlib: require.resolve('browserify-zlib'),
  buffer: require.resolve('buffer/'),
  dns: require.resolve('dns'),
  fs: false,
  // process: require.resolve('process/browser'),
};
