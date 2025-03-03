import {AccountModel} from '@website/model';
import {AccountModel as AccountModelReact} from '@website/model/react';
import {useCallback, useMemo, useState} from 'react';

export function useViewModel() {
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

  const {
    loading: isLoggedInLoading,
    isLoggedIn,
    error: isLoggedInError,
  } = AccountModelReact.useIsLoggedIn();

  return {
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
    logout,
    logoutLoading,
  };
}
