import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';

import {OptionModel} from '../../models/blog/option-model.js';

export const OptionModelHooks = {
  useAbout,
};

const optionModel = new OptionModel();

function useAbout(
  onSuccess?: ResolveCallback<string>,
  onReject?: RejectCallback,
) {
  const {pending, resolvedValue, rejectedError} = usePromise(
    optionModel.getAbout(),
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    about: resolvedValue,
  };
}
