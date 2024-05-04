import {useEffect, useState} from 'react';

import {Account} from '@/apis';

export function useIsLoggedIn(): {loading: boolean; isLoggedIn: boolean} {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsLoggedIn(false);
    void Account.checkSession()
      .then((res) => {
        if (res !== null) {
          const {isInSession} = res;
          setIsLoggedIn(isInSession);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, isLoggedIn};
}
