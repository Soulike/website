import {useEffect, useRef, useState} from 'react';

export type ResolveCallback<T> = (resolvedValue: T) => void | Promise<void>;
export type RejectCallback = (rejectedError: Error) => void | Promise<void>;

/**
 * Handles a promise and tracks its state.
 *
 * This hook handles race conditions: if the promise prop changes before the
 * previous promise completes, only the result from the most recent promise is used.
 */
export function usePromise<T>(
  promise: Promise<T>,
  onResolve?: ResolveCallback<T>,
  onReject?: RejectCallback,
) {
  const [pending, setPending] = useState(true);
  const [resolvedValue, setResolvedValue] = useState<T | null>(null);
  const [rejectedError, setRejectedError] = useState<Error | null>(null);

  // Track the latest promise ID to handle race conditions.
  // When multiple promises are in flight, only the latest one should update state.
  const latestPromiseIdRef = useRef(0);

  useEffect(() => {
    const promiseId = ++latestPromiseIdRef.current;

    setPending(true);
    setResolvedValue(null);
    setRejectedError(null);
    promise
      .then((value: T) => {
        if (promiseId !== latestPromiseIdRef.current) return;
        setResolvedValue(value);
        if (onResolve) {
          void onResolve(value);
        }
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
        if (onReject) {
          void onReject(error);
        }
      })
      .finally(() => {
        if (promiseId !== latestPromiseIdRef.current) return;
        setPending(false);
      });
  }, [promise, onResolve, onReject]);

  return {
    pending,
    resolvedValue,
    rejectedError,
  };
}
