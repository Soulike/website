import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';

import {OptionModel} from '../../models/blog/option-model.js';

export class OptionModelHooks {
  private static readonly optionModel = new OptionModel();

  public static useAbout(
    onSuccess?: ResolveCallback<string>,
    onReject?: RejectCallback,
  ) {
    const {pending, resolvedValue, rejectedError} = usePromise(
      this.optionModel.getAbout(),
      onSuccess,
      onReject,
    );

    return {
      loading: pending,
      error: rejectedError,
      about: resolvedValue,
    };
  }
}
