import {ModelAccessDeniedError} from '@website/model';
import {type ButtonProps, Modal, type ModalFuncProps, notification} from 'antd';
import {useCallback, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router';

import {Loading} from '@/components/Loading';
import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

import {LayoutView} from './view.js';
import {useViewModel} from './view-model.js';

export function Layout() {
  const {
    logout,
    loggedOut,
    logoutLoading,
    logoutError,
    isLoggedIn,
    isLoggedInLoading,
    isLoggedInError,
  } = useViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedInLoading && !isLoggedIn) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
    }
  }, [isLoggedIn, isLoggedInLoading, navigate]);

  useEffect(() => {
    if (!logoutLoading && loggedOut) {
      notification.success({
        message: 'Logged out',
      });
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
    }
  }, [loggedOut, logoutLoading, navigate]);

  useEffect(() => {
    if (isLoggedInError) {
      if (isLoggedInError instanceof ModelAccessDeniedError) {
        notification.error({message: isLoggedInError.message});
      } else {
        showNetworkError(isLoggedInError);
      }
    }

    if (logoutError) {
      if (logoutError instanceof ModelAccessDeniedError) {
        notification.error({message: logoutError.message});
      } else {
        showNetworkError(logoutError);
      }
    }
  }, [isLoggedInError, logoutError]);

  const onExitModalOkButtonClick: ModalFuncProps['onOk'] = useCallback(() => {
    logout();
  }, [logout]);

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
      {isLoggedInLoading && <Loading />}
      {!isLoggedInLoading && (
        <LayoutView onExitButtonClick={onExitButtonClick}>
          <Outlet />
        </LayoutView>
      )}
    </>
  );
}
