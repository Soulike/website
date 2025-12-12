import {useCallback, useState} from 'react';

/**
 * Similar to `usePromise`, but the promise is created lazily until `run` is called.
 */
export function useLazyPromise<ResT, Args extends unknown[]>(
  promiseFactory: (...args: Args) => Promise<ResT>,
) {
  const [pending, setPending] = useState(true);
  const [resolvedValue, setResolvedValue] = useState<ResT | null>(null);
  const [rejectedError, setRejectedError] = useState<Error | null>(null);

  const run = useCallback(
    (...args: Args) => {
      setPending(true);
      setResolvedValue(null);
      setRejectedError(null);
      promiseFactory(...args)
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
    },
    [promiseFactory],
  );

  return {
    run,
    pending,
    resolvedValue,
    rejectedError,
  };
}
