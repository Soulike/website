import {useEffect, useState} from 'react';

import {useMediaQuery} from './useMediaQuery.js';

export enum ColorScheme {
  DARK = 'dark',
  LIGHT = 'light',
}

export function useColorScheme(override?: ColorScheme) {
  const [colorScheme, setColorScheme] = useState(ColorScheme.LIGHT);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    if (override) {
      setColorScheme(override);
      return;
    }

    setColorScheme(isDarkMode ? ColorScheme.DARK : ColorScheme.LIGHT);
  }, [isDarkMode, override]);

  return colorScheme;
}
