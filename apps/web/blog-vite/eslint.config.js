import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfig from '@website/eslint-config';

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
    },
  },
];
