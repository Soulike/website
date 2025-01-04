import {useCallback, useState} from 'react';

import {getAbout, setAbout} from '@/apis/blog/option';

export function useAbout() {
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    setLoading(true);
    const response = await getAbout();
    setLoading(false);
    return response;
  }, []);

  const set = useCallback(async (...params: Parameters<typeof setAbout>) => {
    setLoading(true);
    const response = await setAbout(...params);
    setLoading(false);
    return response;
  }, []);

  return {
    loading,
    get,
    set,
  };
}
