import {AccountModel} from '@module/model/admin';
import {AccountModelHooks} from '@module/model/react/admin';
import {useCallback, useMemo, useState} from 'react';

export function useViewModel() {
  const {logout, logoutLoading} = useLogoutViewModel();

  const {
    loading: isLoggedInLoading,
    isLoggedIn,
    error: isLoggedInError,
  } = AccountModelHooks.useIsLoggedIn();

  return {
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
    logout,
    logoutLoading,
  };
}

function useLogoutViewModel() {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const accountModel = useMemo(() => new AccountModel(), []);

  const logout = useCallback(
    (onSuccess: () => void, onError: (e: Error) => void) => {
      setLogoutLoading(true);
      accountModel
        .logout()
        .then(onSuccess)
        .catch(onError)
        .finally(() => {
          setLogoutLoading(false);
        });
    },
    [accountModel],
  );

  return {
    logout,
    logoutLoading,
  };
}
