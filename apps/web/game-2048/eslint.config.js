import eslintConfig from '@library/eslint-config';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  ...eslintConfig.recommendedReactTs,
  {ignores: ['dist']},
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
];
