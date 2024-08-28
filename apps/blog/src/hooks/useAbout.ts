import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Option} from '@/src/apis';
import {showNetworkError} from '@/src/apis/utils';

export function useAbout(): {loading: boolean; about: string | null} {
  const [about, setAbout] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void Option.getAbout()
      .then((response) => {
        if (response.isSuccessful) {
          const {
            data: {about},
          } = response;
          setAbout(about);
        } else {
          notification.warning({message: response.message});
        }
      })
      .catch((e) => {
        showNetworkError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, about};
}
