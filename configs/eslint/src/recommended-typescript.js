import path from 'node:path';

import tseslint from 'typescript-eslint';

import recommendedJavaScript from './recommended-javascript.js';

export default [
  ...recommendedJavaScript,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve('./'),
      },
    },
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          considerDefaultExhaustiveForUnions: false,
        },
      ],
      '@typescript-eslint/unified-signatures': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            ':matches(TSAsExpression, TSTypeAssertion) > :matches(TSAsExpression, TSTypeAssertion).expression',
          message: 'Do not use chained type assertions.',
        },
      ],
    },
  },
];
