import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

import recommendedTypeScript from './recommended-typescript.js';

export default [
  ...recommendedTypeScript,
  reactPlugin.configs.flat['recommended'],
  reactPlugin.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },
];
