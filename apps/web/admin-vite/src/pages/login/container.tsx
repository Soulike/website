import {notification} from 'antd';
import {
  type DOMAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {useNavigate} from 'react-router';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {LoginView} from './view.js';
import {useViewModel} from './view-model.js';

export function Login() {
  const {
    login,
    loginLoading,
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
    username,
    onUsernameInputChange,
    password,
    onPasswordInputChange,
  } = useViewModel();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoggedInLoading && isLoggedIn) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.INDEX], {replace: true});
    }
  }, [isLoggedIn, isLoggedInLoading, navigate]);

  useEffect(() => {
    if (isLoggedInError) {
      showErrorNotification(isLoggedInError);
    }
  }, [isLoggedInError]);

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
      loading={isLoggedInLoading}
      isLoggingIn={loginLoading}
      username={username}
      password={password}
      onLoginFormSubmit={onLoginFormSubmit}
      onPasswordInputChange={onPasswordInputChange}
      onUsernameInputChange={onUsernameInputChange}
    />
  );
}
