import {useRouter} from 'next/router';
import {useCallback} from 'react';

type SetterType = (_value: string | null) => void;

export function useSearchParam(paramName: string): [string | null, SetterType] {
  const router = useRouter();
  const rawValue = router.query[paramName];
  const value =
    typeof rawValue === 'string'
      ? rawValue
      : rawValue === undefined
        ? null
        : rawValue[0];

  const setValue: SetterType = useCallback(
    (value) => {
      const query: typeof router.query = {...router.query};
      if (value !== null) {
        query[paramName] = value;
      } else {
        delete query[paramName];
      }

      void router.push({
        pathname: router.pathname,
        query,
      });
    },
    [paramName, router],
  );

  return [value, setValue];
}
