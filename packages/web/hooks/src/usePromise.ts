import {useEffect, useState} from 'react';

export type ResolveCallback<T> = (resolvedValue: T) => void | Promise<void>;
export type RejectCallback = (rejectedError: Error) => void | Promise<void>;

export function usePromise<T>(
  promise: Promise<T>,
  onResolve?: ResolveCallback<T>,
  onReject?: RejectCallback,
) {
  const [pending, setPending] = useState(true);
  const [resolvedValue, setResolvedValue] = useState<T | null>(null);
  const [rejectedError, setRejectedError] = useState<Error | null>(null);

  useEffect(() => {
    setPending(true);
    setResolvedValue(null);
    setRejectedError(null);
    promise
      .then((value: T) => {
        setResolvedValue(value);
        if (onResolve) {
          void onResolve(value);
        }
      })
      .catch((e: unknown) => {
        let error: Error;
        if (!(e instanceof Error)) {
          error = new Error();
          error.cause = error;
        } else {
          error = e;
        }
        setRejectedError(error);
        if (onReject) {
          void onReject(error);
        }
      })
      .finally(() => {
        setPending(false);
      });
  }, [promise, onResolve, onReject]);

  return {
    pending,
    resolvedValue,
    rejectedError,
  };
}
