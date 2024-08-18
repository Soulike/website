'use client';

import {type InputProps, notification} from 'antd';
import {useRouter} from 'next/navigation';
import {type DOMAttributes, useCallback, useEffect, useState} from 'react';

import {Account} from '@/apis';
import {showNetworkError} from '@/apis/utils';
import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';
import {useIsLoggedIn} from '@/hooks/useIsLoggedIn';

import {LoginView} from './View';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {loading, isLoggedIn} = useIsLoggedIn();

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      void router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]);
    }
  }, [isLoggedIn, router]);

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
      async (e) => {
        e.preventDefault();
        try {
          const response = await Account.login(username, password);
          if (response.isSuccessful) {
            notification.success({message: '登录成功'});
            router.push(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]);
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch {
          await showNetworkError();
        }
      },
      [router, password, username],
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
