import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Input, type InputProps} from 'antd';
import {type DOMAttributes} from 'react';

import {Loading} from '@/components/Loading';

import web_developer from './assets/web_developer.svg';
import styles from './styles.module.css';

interface Props {
  loading: boolean;
  username: string;
  password: string;
  onUsernameInputChange: InputProps['onChange'];
  onPasswordInputChange: InputProps['onChange'];
  onLoginFormSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
}

export function LoginView(props: Props) {
  const {
    loading,
    username,
    password,
    onUsernameInputChange,
    onPasswordInputChange,
    onLoginFormSubmit,
  } = props;
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <main className={styles.login}>
          <form
            action={'#'}
            className={styles.form}
            onSubmit={onLoginFormSubmit}
          >
            <img
              className={styles.logo}
              src={web_developer}
              alt='web developer image'
            />
            <Input
              type={'text'}
              size={'large'}
              onChange={onUsernameInputChange}
              autoFocus={true}
              value={username}
              placeholder={'Username'}
              prefix={<UserOutlined />}
            />
            <Input
              type={'password'}
              size={'large'}
              onChange={onPasswordInputChange}
              value={password}
              placeholder={'Password'}
              prefix={<LockOutlined />}
            />
            <Button
              htmlType={'submit'}
              className={styles.button}
              size={'large'}
              type={'primary'}
              block={true}
            >
              Login
            </Button>
          </form>
        </main>
      )}
    </>
  );
}
