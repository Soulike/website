import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {User} from '@module/classes';
import {useSession} from '@module/session-context';
import {CreateSessionResult} from '@module/session-sdk';
import {useCallback, useState} from 'react';

export function useViewModel() {
  const {session, isLoadingSession, createSession} = useSession();
  const {login, loginLoading} = useLogin(createSession);

  const {value: username, onChange: onUsernameInputChange} = useTextInput();
  const {value: password, onChange: onPasswordInputChange} = useTextInput();

  return {
    login,
    loginLoading,
    session,
    isLoadingSession,
    username,
    onUsernameInputChange,
    password,
    onPasswordInputChange,
  };
}

function useLogin(createSession: (user: User) => Promise<CreateSessionResult>) {
  const [loginLoading, setLoginLoading] = useState(false);

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
      createSession(new User(username, password))
        .then((result) => {
          if (result === CreateSessionResult.SUCCESS) {
            onSuccess?.();
          } else {
            onError?.(new Error('Wrong username or password'));
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
    [createSession],
  );

  return {
    loginLoading,
    login,
  };
}
