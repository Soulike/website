import assert from 'node:assert';

import {useTextInputViewModel} from '@website/hooks';
import {AccountModel} from '@website/model';
import {AccountModelHooks} from '@website/model/react';
import {useCallback, useMemo, useState} from 'react';

export function useViewModel() {
  const {
    isLoggedIn,
    loading: isLoggedInLoading,
    error: isLoggedInError,
  } = AccountModelHooks.useIsLoggedIn();

  const {login, loginLoading} = useLoginViewModel();

  const {value: username, onChange: onUsernameInputChange} =
    useTextInputViewModel();
  const {value: password, onChange: onPasswordInputChange} =
    useTextInputViewModel();

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

function useLoginViewModel() {
  const [loginLoading, setLoginLoading] = useState(false);
  const accountModel = useMemo(() => new AccountModel(), []);

  const login = useCallback(
    (
      username: string,
      password: string,
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      setLoginLoading(true);
      accountModel
        .login(username, password)
        .then(() => {
          if (onSuccess) {
            onSuccess();
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
    [accountModel],
  );

  return {
    loginLoading,
    login,
  };
}
