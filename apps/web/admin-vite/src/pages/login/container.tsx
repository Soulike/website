import {notification} from 'antd';
import {
  type DOMAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {useNavigate} from 'react-router';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {getI18nString, STRING_KEY} from '@/i18n/index.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {LoginView} from './view.js';
import {useViewModel} from './view-model.js';

export function Login() {
  const {
    login,
    loginLoading,
    session,
    sessionError,
    isLoadingSession,
    username,
    onUsernameInputChange,
    password,
    onPasswordInputChange,
  } = useViewModel();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoadingSession && session) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.INDEX], {replace: true});
    }
  }, [session, isLoadingSession, navigate]);

  useEffect(() => {
    if (sessionError) {
      showErrorNotification(sessionError);
    }
  }, [sessionError]);

  const showErrorMessage = useCallback((message: string) => {
    notification.error({title: message});
  }, []);

  const onLoginFormSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] =
    useCallback<Exclude<DOMAttributes<HTMLFormElement>['onSubmit'], undefined>>(
      (e) => {
        e.preventDefault();
        login(
          username,
          password,
          showErrorMessage,
          () => {
            getI18nString(STRING_KEY.UI_MESSAGE_LOGIN_SUCCESS)
              .then((message) => {
                notification.success({title: message});
              })
              .catch((e: unknown) => {
                console.error(e);
              });
          },
          showErrorMessage,
          (error) => {
            showErrorNotification(error);
          },
        );
      },
      [login, password, showErrorMessage, username],
    );

  return (
    <LoginView
      loading={isLoadingSession}
      isLoggingIn={loginLoading}
      username={username}
      password={password}
      onLoginFormSubmit={onLoginFormSubmit}
      onPasswordInputChange={onPasswordInputChange}
      onUsernameInputChange={onUsernameInputChange}
    />
  );
}
