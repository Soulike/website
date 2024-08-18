'use client';

import {type ButtonProps, Modal, type ModalFuncProps, notification} from 'antd';
import {useRouter} from 'next/navigation';
import {type ReactNode, useCallback, useEffect} from 'react';

import {Account as AccountApi} from '@/apis';
import {showNetworkError} from '@/apis/utils';
import {Loading} from '@/components/Loading';
import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';
import {useIsLoggedIn} from '@/hooks/useIsLoggedIn';

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
      try {
        const response = await AccountApi.logout();
        if (response.isSuccessful) {
          notification.success({
            message: '退出成功',
          });
          router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.LOGIN]);
        } else {
          const {message} = response;
          notification.warning({
            message,
          });
        }
      } catch {
        await showNetworkError();
      }
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
        <FrameView onExitButtonClick={onExitButtonClick}>{children}</FrameView>
      )}
    </>
  );
}
