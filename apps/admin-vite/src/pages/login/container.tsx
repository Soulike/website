import {type InputProps, notification} from 'antd';
import {type DOMAttributes, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

import {Account} from '@/apis';
import {showNetworkError} from '@/apis/utils';
import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';
import {useIsLoggedIn} from '@/hooks/useIsLoggedIn';

import {LoginView} from './view.tsx';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {loading, isLoggedIn} = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      void navigate(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX], {replace: true});
    }
  }, [isLoggedIn, navigate]);

  const onUsernameInputChange: InputProps['onChange'] = useCallback<
    Exclude<InputProps['onChange'], undefined>
  >((e) => {
    setUsername(e.target.value);
  }, []);

  const onPasswordInputChange: InputProps['onChange'] = useCallback<
    Exclude<InputProps['onChange'], undefined>
  >((e) => {
    setPassword(e.target.value);
  }, []);

  const onLoginFormSubmit: DOMAttributes<HTMLFormElement>['onSubmit'] =
    useCallback<Exclude<DOMAttributes<HTMLFormElement>['onSubmit'], undefined>>(
      (e) => {
        e.preventDefault();
        try {
          if (!username || !password) {
            notification.error({message: 'Please input username and password'});
            return;
          }

          const requestHandler = async () => {
            const response = await Account.login(username, password);
            if (response.isSuccessful) {
              notification.success({message: 'Successfully Logged In'});
              await navigate(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]);
            } else {
              const {message} = response;
              notification.warning({message});
            }
          };
          void requestHandler();
        } catch (err) {
          showNetworkError(err);
        }
      },
      [navigate, password, username],
    );

  return (
    <LoginView
      loading={loading}
      username={username}
      password={password}
      onLoginFormSubmit={onLoginFormSubmit}
      onPasswordInputChange={onPasswordInputChange}
      onUsernameInputChange={onUsernameInputChange}
    />
  );
}
