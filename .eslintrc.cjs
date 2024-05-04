module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  overrides: [],
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': true,
    'tsconfigRootDir': __dirname
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort'
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off'
  },
  root: true
};
