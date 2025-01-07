import {Account as AccountApi} from '@website/server-api';
import {type ButtonProps, Modal, type ModalFuncProps, notification} from 'antd';
import {useCallback, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router';

import {Loading} from '@/components/Loading';
import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {useIsLoggedIn} from '@/hooks/useIsLoggedIn.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

import {LayoutView} from './view.js';

export function Layout() {
  const navigate = useNavigate();

  const {loading, isLoggedIn} = useIsLoggedIn();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
    }
  }, [isLoggedIn, loading, navigate]);

  const onExitModalOkButtonClick: ModalFuncProps['onOk'] =
    useCallback(async () => {
      try {
        const response = await AccountApi.logout();
        if (response.isSuccessful) {
          notification.success({
            message: 'Logged out',
          });
          void navigate(PAGE_ID_TO_PATH[PAGE_ID.LOGIN], {replace: true});
        } else {
          const {message} = response;
          notification.warning({
            message,
          });
        }
      } catch (err) {
        showNetworkError(err);
      }
    }, [navigate]);

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
      {loading && <Loading />}
      {!loading && (
        <LayoutView onExitButtonClick={onExitButtonClick}>
          <Outlet />
        </LayoutView>
      )}
    </>
  );
}
