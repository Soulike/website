import assert from 'node:assert';

import {useTextInput} from '@library/hooks';
import {useSession} from '@module/session-context';
import {CreateSessionResult} from '@module/session-sdk';
import {type LoginCredentials, LoginCredentialsSchema} from '@schema/auth';
import {useCallback, useState} from 'react';

import {
  getValidationErrorMessage,
  LOGIN_CREDENTIALS_FIELD_LABELS,
} from '@/helpers/validation-i18n-helper.js';
import {getI18nString, STRING_KEY} from '@/i18n/index.js';

export function useViewModel() {
  const {session, sessionError, isLoadingSession, createSession} = useSession();
  const {login, loginLoading} = useLogin(createSession);

  const {value: username, onChange: onUsernameInputChange} = useTextInput();
  const {value: password, onChange: onPasswordInputChange} = useTextInput();

  return {
    login,
    loginLoading,
    session,
    sessionError,
    isLoadingSession,
    username,
    onUsernameInputChange,
    password,
    onPasswordInputChange,
  };
}

function useLogin(
  createSession: (
    credentials: LoginCredentials,
  ) => Promise<CreateSessionResult>,
) {
  const [loginLoading, setLoginLoading] = useState(false);

  const login = useCallback(
    (
      username: string,
      password: string,
      onValidationFailed: (message: string) => void,
      onSuccess?: () => void,
      onUnauthorized?: (message: string) => void,
      onError?: (error: Error) => void,
    ) => {
      const parsedCredentials = LoginCredentialsSchema.safeParse({
        username,
        password,
      });
      if (!parsedCredentials.success) {
        const firstIssue = parsedCredentials.error.issues[0];
        getValidationErrorMessage(firstIssue, LOGIN_CREDENTIALS_FIELD_LABELS)
          .then((message) => {
            onValidationFailed(message);
          })
          .catch((e: unknown) => {
            console.error(e);
          });
        return;
      }

      setLoginLoading(true);
      createSession(parsedCredentials.data)
        .then((result) => {
          if (result === CreateSessionResult.SUCCESS) {
            onSuccess?.();
            return;
          }
          getI18nString(STRING_KEY.UI_MESSAGE_LOGIN_WRONG_CREDENTIALS)
            .then((message) => {
              onUnauthorized?.(message);
            })
            .catch((e: unknown) => {
              console.error(e);
            });
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
