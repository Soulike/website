import {OptionModel} from '@models/blog/option-model.js';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useMemo} from 'react';

export const OptionModelHooks = Object.freeze({
  useAbout,
});

const optionModel = new OptionModel();

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
