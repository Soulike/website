import {showNetworkError} from '@/helpers/error_notification_helper.js';
import {Account} from '@website/server-api';
import {useEffect, useState} from 'react';

export function useIsLoggedIn(): {loading: boolean; isLoggedIn: boolean} {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsLoggedIn(false);
    void Account.checkSession()
      .then((response) => {
        if (response.isSuccessful) {
          const {
            data: {isInSession},
          } = response;
          setIsLoggedIn(isInSession);
        }
      })
      .catch((err: unknown) => {
        setIsLoggedIn(false);
        showNetworkError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, isLoggedIn};
}
