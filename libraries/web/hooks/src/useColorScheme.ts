import {useMediaQuery} from './useMediaQuery.js';

export enum ColorScheme {
  DARK = 'dark',
  LIGHT = 'light',
}

export function useColorScheme(override?: ColorScheme) {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  if (override !== undefined) {
    return override;
  }

  return isDarkMode ? ColorScheme.DARK : ColorScheme.LIGHT;
}
