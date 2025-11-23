import type {RejectCallback, ResolveCallback} from '@library/hooks';
import {usePromise} from '@library/hooks';
import {AccountModel} from '@module/model/admin';
import {useMemo} from 'react';

export const AccountModelHooks = {
  useIsLoggedIn,
};

const accountModel = new AccountModel();

function useIsLoggedIn(
  onSuccess?: ResolveCallback<boolean>,
  onError?: RejectCallback,
) {
  const promise = useMemo(() => accountModel.isLoggedIn(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onError,
  );

  return {
    isLoggedIn: resolvedValue,
    loading: pending,
    error: rejectedError,
  };
}
