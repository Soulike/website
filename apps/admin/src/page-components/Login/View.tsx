import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Input} from 'antd';
import {type InputProps} from 'antd/lib/input';
import {type DOMAttributes} from 'react';

import {Loading} from '@/components/Loading';
import web_developer from '@/static/Login/web_developer.svg';

import Style from './Style.module.scss';

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
                <main className={Style.Login}>
                    <form
                        action={'#'}
                        className={Style.form}
                        onSubmit={onLoginFormSubmit}
                    >
                        <img
                            className={Style.logo}
                            src={web_developer.src}
                            alt='web_developer_logo'
                        />
                        <Input
                            type={'text'}
                            size={'large'}
                            onChange={onUsernameInputChange}
                            autoFocus={true}
                            value={username}
                            placeholder={'用户名'}
                            prefix={<UserOutlined />}
                        />
                        <Input
                            type={'password'}
                            size={'large'}
                            onChange={onPasswordInputChange}
                            value={password}
                            placeholder={'密码'}
                            prefix={<LockOutlined />}
                        />
                        <Button
                            htmlType={'submit'}
                            className={Style.button}
                            size={'large'}
                            type={'primary'}
                            block={true}
                        >
                            登录
                        </Button>
                    </form>
                </main>
            )}
        </>
    );
}
