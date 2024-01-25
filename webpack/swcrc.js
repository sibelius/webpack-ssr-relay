// refresh true is slower
const refresh = process.env.SWC_FAST_REFRESH === 'true';

module.exports = {
  jsc: {
    experimental: {
      plugins: [
        [
          '@swc/plugin-relay',
          {
            rootDir: __dirname,
            language: 'typescript',
          },
        ],
      ],
    },
    parser: {
      syntax: 'typescript',
      tsx: true,
    },
    transform: {
      react: {
        runtime: 'automatic',
        refresh,
      },
    },
  },
};
