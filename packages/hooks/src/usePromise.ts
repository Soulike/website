import assert from 'node:assert';

import {useEffect, useState} from 'react';

export function usePromise<T>(promise: Promise<T>) {
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
      })
      .catch((e: unknown) => {
        assert(
          e instanceof Error,
          'Promise should reject with an Error instance.',
        );
        setRejectedError(e);
      })
      .finally(() => {
        setPending(false);
      });
  }, [promise]);

  return {
    pending,
    resolvedValue,
    rejectedError,
  };
}
