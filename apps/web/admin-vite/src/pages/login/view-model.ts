import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {AccountModel} from '@module/model/admin';
import {AccountModelHooks} from '@module/model/react/admin';
import {useCallback, useLayoutEffect, useMemo, useState} from 'react';

export function useViewModel() {
  const {isLoggedIn, isLoggedInError, isLoggedInLoading, setIsLoggedIn} =
    useIsLoggedIn();
  const {login, loginLoading} = useLogin(() => {
    setIsLoggedIn(true);
  });

  const {value: username, onChange: onUsernameInputChange} = useTextInput();
  const {value: password, onChange: onPasswordInputChange} = useTextInput();

  return {
    login,
    loginLoading,
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
    username,
    onUsernameInputChange,
    password,
    onPasswordInputChange,
  };
}

function useIsLoggedIn() {
  const [isLoggedInCache, setIsLoggedInCache] = useState<boolean | null>(null);
  const {
    isLoggedIn,
    loading: isLoggedInLoading,
    error: isLoggedInError,
  } = AccountModelHooks.useIsLoggedIn();
  useLayoutEffect(() => {
    setIsLoggedInCache(isLoggedIn);
  }, [isLoggedIn]);

  return {
    isLoggedIn: isLoggedInCache,
    setIsLoggedIn: setIsLoggedInCache,
    isLoggedInLoading,
    isLoggedInError,
  };
}

function useLogin(afterLoggedIn?: () => void) {
  const [loginLoading, setLoginLoading] = useState(false);
  const accountModel = useMemo(() => new AccountModel(), []);

  const login = useCallback(
    (
      username: string,
      password: string,
      onValidationFailed: (message: string) => void,
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      if (!username) {
        onValidationFailed('Please input username');
        return;
      }
      if (!password) {
        onValidationFailed('Please input password');
        return;
      }
      setLoginLoading(true);
      accountModel
        .login(username, password)
        .then(() => {
          if (onSuccess) {
            onSuccess();
            afterLoggedIn?.();
          }
        })
        .catch((e: unknown) => {
          if (onError) {
            assert(e instanceof Error);
            onError(e);
          }
        })
        .finally(() => {
          setLoginLoading(false);
        });
    },
    [accountModel, afterLoggedIn],
  );

  return {
    loginLoading,
    login,
  };
}
