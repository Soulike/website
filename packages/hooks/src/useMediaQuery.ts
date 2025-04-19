import {useCallback, useEffect, useState} from 'react';

export function useMediaQuery(query: string) {
  const [queryResult, setQueryResult] = useState(false);

  const mediaQueryListChangeCallback = useCallback((e: MediaQueryListEvent) => {
    setQueryResult(e.matches);
  }, []);

  useEffect(() => {
    const mediaQueryList = matchMedia(query);
    mediaQueryList.addEventListener('change', mediaQueryListChangeCallback);

    return () => {
      mediaQueryList.removeEventListener(
        'change',
        mediaQueryListChangeCallback,
      );
    };
  }, [mediaQueryListChangeCallback, query]);

  return queryResult;
}
