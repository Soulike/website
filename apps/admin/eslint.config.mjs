import {FlatCompat} from '@eslint/eslintrc';
import eslintConfig from '@website/eslint-config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...compat.extends('next', 'next/core-web-vitals', 'next/typescript'),
  ...eslintConfig.recommendedTypeScript,
];
