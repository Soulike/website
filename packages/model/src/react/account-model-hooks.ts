import type {RejectCallback, ResolveCallback} from '@website/hooks';
import {usePromise} from '@website/hooks';
import {AccountModel} from '@website/model';

const accountModel = new AccountModel();

export const AccountModelHooks = {
  useIsLoggedIn,
};

function useIsLoggedIn(
  onSuccess?: ResolveCallback<boolean>,
  onError?: RejectCallback,
) {
  const {pending, resolvedValue, rejectedError} = usePromise(
    accountModel.isLoggedIn(),
    onSuccess,
    onError,
  );

  return {
    isLoggedIn: resolvedValue,
    loading: pending,
    error: rejectedError,
  };
}
