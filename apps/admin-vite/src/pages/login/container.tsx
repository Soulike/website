import {useTextInputViewModel} from '@website/hooks';
import {ModelAccessDeniedError} from '@website/model';
import {notification} from 'antd';
import {type DOMAttributes, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {LoginView} from './view.js';
import {useViewModel} from './view-model.js';

export function Login() {
  const {value: username, onChange: onUsernameInputChange} =
    useTextInputViewModel();
  const {value: password, onChange: onPasswordInputChange} =
    useTextInputViewModel();
  const {
    login,
    loginLoading,
    loginError,
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
  } = useViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.INDEX], {replace: true});
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (loginError) {
      if (loginError instanceof ModelAccessDeniedError) {
        notification.warning({message: loginError.message});
      } else {
        showNetworkError(loginError);
      }
    }
    if (isLoggedInError) {
      if (loginError instanceof ModelAccessDeniedError) {
        notification.warning({message: isLoggedInError.message});
      } else {
        showNetworkError(loginError);
      }
    }
  }, [isLoggedInError, loginError]);

  const onLoginFormSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] =
    useCallback<Exclude<DOMAttributes<HTMLFormElement>['onSubmit'], undefined>>(
      (e) => {
        e.preventDefault();
        login(username, password);
      },
      [login, password, username],
    );

  return (
    <LoginView
      loading={isLoggedInLoading || loginLoading}
      username={username}
      password={password}
      onLoginFormSubmit={onLoginFormSubmit}
      onPasswordInputChange={onPasswordInputChange}
      onUsernameInputChange={onUsernameInputChange}
    />
  );
}
