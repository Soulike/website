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
    logoutLoading,
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
    if (isLoggedInError) {
      if (isLoggedInError instanceof ModelAccessDeniedError) {
        notification.error({message: isLoggedInError.message});
      } else {
        showNetworkError(isLoggedInError);
      }
    }
  }, [isLoggedInError]);

  const onExitModalOkButtonClick: ModalFuncProps['onOk'] = useCallback(() => {
    logout(
      () => {
        notification.success({
          message: 'Logged out',
        });
        void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
      },
      (e) => {
        if (e instanceof ModelAccessDeniedError) {
          notification.error({message: e.message});
        } else {
          showNetworkError(e);
        }
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
      {(isLoggedInLoading || logoutLoading) && <Loading />}
      {!isLoggedInLoading && (
        <LayoutView onExitButtonClick={onExitButtonClick}>
          <Outlet />
        </LayoutView>
      )}
    </>
  );
}
