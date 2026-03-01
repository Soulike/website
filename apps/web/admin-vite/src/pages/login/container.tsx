import {notification} from 'antd';
import {type DOMAttributes, useCallback, useLayoutEffect} from 'react';
import {useNavigate} from 'react-router';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {LoginView} from './view.js';
import {useViewModel} from './view-model.js';

export function Login() {
  const {
    login,
    loginLoading,
    session,
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

  const onLoginFormSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] =
    useCallback<Exclude<DOMAttributes<HTMLFormElement>['onSubmit'], undefined>>(
      (e) => {
        e.preventDefault();
        login(
          username,
          password,
          (message) => {
            notification.error({title: message});
          },
          () => {
            notification.success({title: 'Successfully logged in'});
          },
          (error) => {
            showErrorNotification(error);
          },
        );
      },
      [login, password, username],
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
