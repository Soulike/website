import {AccountModel} from '@website/model';
import {useCallback, useMemo, useState} from 'react';

import {useIsLoggedIn} from '@/hooks/useIsLoggedIn.js';

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
  } = useIsLoggedIn();

  return {
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
    logout,
    logoutLoading,
  };
}
