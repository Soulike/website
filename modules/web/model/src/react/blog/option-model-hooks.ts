import {optionModel} from '@models/blog/index.js';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useMemo} from 'react';

export const OptionModelHooks = Object.freeze({
  useAbout,
});

function useAbout(
  onSuccess?: ResolveCallback<string>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => optionModel.getAbout(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    about: resolvedValue,
  };
}
