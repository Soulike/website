'use client';

import {useEffect, useState} from 'react';

import {Account} from '@/apis';
import {showNetworkError} from '@/apis/utils';

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
      .catch(() => {
        setIsLoggedIn(false);
        void showNetworkError();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, isLoggedIn};
}
