import assert from 'node:assert';

import {AccountModel} from '@website/model';
import {useCallback, useMemo, useState} from 'react';

import {useIsLoggedIn} from '@/hooks/useIsLoggedIn.js';

export function useViewModel() {
  const [loggedOut, setLoggedOut] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<Error | null>(null);

  const accountModel = useMemo(() => new AccountModel(), []);

  const logout = useCallback(() => {
    setLoggedOut(false);
    setLogoutLoading(true);
    setLogoutError(null);
    accountModel
      .logout()
      .then(() => {
        setLoggedOut(true);
      })
      .catch((e: unknown) => {
        assert(e instanceof Error);
        setLogoutError(e);
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }, [accountModel]);

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
    loggedOut,
    logoutLoading,
    logoutError,
  };
}
