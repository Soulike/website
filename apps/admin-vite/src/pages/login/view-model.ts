import {AccountModel} from '@website/model';
import {useCallback, useMemo, useState} from 'react';

import {useIsLoggedIn} from '@/hooks/useIsLoggedIn.js';

export function useViewModel() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);

  const accountModel = useMemo(() => new AccountModel(), []);

  const login = useCallback(
    (username: string, password: string) => {
      setLoginLoading(true);
      setLoginError(null);
      accountModel
        .login(username, password)
        .catch((e: unknown) => {
          setLoginError(e as Error);
        })
        .finally(() => {
          setLoginLoading(false);
        });
    },
    [accountModel],
  );

  const {
    isLoggedIn,
    loading: isLoggedInLoading,
    error: isLoggedInError,
  } = useIsLoggedIn();

  return {
    login,
    loginLoading,
    loginError,
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
  };
}
