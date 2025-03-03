import type {RejectCallback, ResolveCallback} from '@website/hooks';
import {usePromise} from '@website/hooks';
import {AccountModel as RawAccountModel} from '@website/model';

export class AccountModelHooks {
  private static readonly accountModel = new RawAccountModel();

  public static useIsLoggedIn(
    onSuccess?: ResolveCallback<boolean>,
    onError?: RejectCallback,
  ) {
    const {pending, resolvedValue, rejectedError} = usePromise(
      this.accountModel.isLoggedIn(),
      onSuccess,
      onError,
    );

    return {
      isLoggedIn: resolvedValue,
      loading: pending,
      error: rejectedError,
    };
  }
}
