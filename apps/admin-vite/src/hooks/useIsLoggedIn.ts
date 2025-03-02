import {usePromise} from '@website/hooks';
import {AccountModel} from '@website/model';
import {useMemo} from 'react';

export function useIsLoggedIn() {
  const accountModel = useMemo(() => new AccountModel(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    accountModel.isLoggedIn(),
  );
  return {
    isLoggedIn: resolvedValue,
    loading: pending,
    error: rejectedError,
  };
}
