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


module.exports = {
  presets: [
    ...config.presets,
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    // '@babel/transform-modules-commonjs',
    ...config.plugins,
  ],
};
