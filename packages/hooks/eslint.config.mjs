import eslintConfig from '@website/eslint-config';
import hooksPlugin from 'eslint-plugin-react-hooks';

export default [
  ...eslintConfig.recommendedTypeScript,
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    }
  }
];
