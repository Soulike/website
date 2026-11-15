import eslintConfig from '@config/eslint';

export default [
  ...eslintConfig.recommendedTypeScript.map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  ...eslintConfig.recommendedJavaScript.map((config) => ({
    files: ['eslint.config.mjs'],
    ...config,
  })),
];
