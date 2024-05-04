import {Modal, notification} from 'antd';
import {type ButtonProps} from 'antd';
import {type ModalFuncProps} from 'antd';
import {useRouter} from 'next/router';
import {type ReactNode, useCallback, useEffect} from 'react';

import {Account as AccountApi} from '@/apis';
import {Loading} from '@/components/Loading';
import {useIsLoggedIn} from '@/hooks/useIsLoggedIn';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '../../config/route';
import {FrameView} from './View';

export interface IFrameProps {
    children: ReactNode;
}

export function Frame(props: IFrameProps) {
    const {children} = props;
    const router = useRouter();

    const {loading, isLoggedIn} = useIsLoggedIn();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            void router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.LOGIN]);
        }
    }, [isLoggedIn, loading, router]);

    const onExitModalOkButtonClick: ModalFuncProps['onOk'] =
        useCallback(async () => {
            await AccountApi.logout();
            notification.success({
                message: '退出成功',
            });
            await router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.LOGIN]);
        }, [router]);

    const onExitButtonClick: ButtonProps['onClick'] = useCallback<
        Exclude<ButtonProps['onClick'], undefined>
    >(
        (e) => {
            e.preventDefault();
            Modal.confirm({
                content: '确认退出？',
                onOk: onExitModalOkButtonClick,
            });
        },
        [onExitModalOkButtonClick],
    );

    return (
        <>
            {loading && <Loading />}
            {!loading && (
                <FrameView onExitButtonClick={onExitButtonClick}>
                    {children}
                </FrameView>
            )}
        </>
    );
}
