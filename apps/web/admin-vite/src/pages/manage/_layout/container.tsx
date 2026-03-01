import {type ButtonProps, Modal, type ModalFuncProps, notification} from 'antd';
import {useCallback, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router';

import {Loading} from '@/components/Loading';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

import {LayoutView} from './view.js';
import {useViewModel} from './view-model.js';

export function Layout() {
  const {logout, logoutLoading, session, isLoadingSession} = useViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingSession && !session) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
    }
  }, [session, isLoadingSession, navigate]);

  const onExitModalOkButtonClick: ModalFuncProps['onOk'] = useCallback(() => {
    logout(
      () => {
        notification.success({
          message: 'Logged out',
        });
        void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
      },
      (e) => {
        showErrorNotification(e);
      },
    );
  }, [logout, navigate]);

  const onExitButtonClick: ButtonProps['onClick'] = useCallback<
    Exclude<ButtonProps['onClick'], undefined>
  >(
    (e) => {
      e.preventDefault();
      Modal.confirm({
        content: 'Confirm logout？',
        onOk: onExitModalOkButtonClick,
      });
    },
    [onExitModalOkButtonClick],
  );

  return (
    <>
      {(isLoadingSession || logoutLoading) && <Loading />}
      {!isLoadingSession && (
        <LayoutView onExitButtonClick={onExitButtonClick}>
          <Outlet />
        </LayoutView>
      )}
    </>
  );
}
