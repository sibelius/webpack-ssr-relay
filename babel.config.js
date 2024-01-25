const config = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'relay',
      {
        schema: 'data/schema.graphql',
      },
    ],
  ],
};


module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const enableFastRefresh = !api.env('production') && !api.env('test');

  return {
    presets: [
      ...config.presets,
      [
        '@babel/preset-env',
        {
          corejs: 3,
          modules: false,
          useBuiltIns: 'usage',
        },
      ],
    ],
    plugins: [
      ...config.plugins,
      // Applies the react-refresh Babel plugin on non-production modes only
      ...(enableFastRefresh ? ['react-refresh/babel'] : []),
    ],
  };
};