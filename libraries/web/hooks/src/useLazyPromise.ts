import {useCallback, useRef, useState} from 'react';

/**
 * Similar to `usePromise`, but the promise is created lazily until `run` is called.
 *
 * This hook handles race conditions: if `run` is called multiple times before
 * previous promises complete, only the result from the most recent call is used.
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

  // Track the latest promise ID to handle race conditions.
  // When multiple promises are in flight, only the latest one should update state.
  const latestPromiseIdRef = useRef(0);

  const run = useCallback((...args: Args) => {
    const promiseId = ++latestPromiseIdRef.current;

    setPending(true);
    setResolvedValue(null);
    setRejectedError(null);
    promiseFactoryRef
      .current(...args)
      .then((value) => {
        if (promiseId !== latestPromiseIdRef.current) return;
        setResolvedValue(value);
      })
      .catch((e: unknown) => {
        if (promiseId !== latestPromiseIdRef.current) return;
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
        if (promiseId !== latestPromiseIdRef.current) return;
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
