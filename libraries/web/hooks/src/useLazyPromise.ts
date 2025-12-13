import {useCallback, useRef, useState} from 'react';

/**
 * Similar to `usePromise`, but the promise is created lazily until `run` is called.
 */
export function useLazyPromise<ResT, Args extends unknown[]>(
  promiseFactory: (...args: Args) => Promise<ResT>,
) {
  const [pending, setPending] = useState(true);
  const [resolvedValue, setResolvedValue] = useState<ResT | null>(null);
  const [rejectedError, setRejectedError] = useState<Error | null>(null);

  // Use ref to always access the latest promiseFactory without causing `run` to
  // be recreated. This ensures `run` has a stable identity across renders,
  // making it safe to use in useEffect dependency arrays.
  const promiseFactoryRef = useRef(promiseFactory);
  promiseFactoryRef.current = promiseFactory;

  const run = useCallback((...args: Args) => {
    setPending(true);
    setResolvedValue(null);
    setRejectedError(null);
    promiseFactoryRef
      .current(...args)
      .then((value) => {
        setResolvedValue(value);
      })
      .catch((e: unknown) => {
        let error: Error;
        if (!(e instanceof Error)) {
          error = new Error();
          error.cause = e;
        } else {
          error = e;
        }
        setRejectedError(error);
      })
      .finally(() => {
        setPending(false);
      });
  }, []);

  return {
    run,
    pending,
    resolvedValue,
    rejectedError,
  };
}
