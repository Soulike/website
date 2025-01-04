import {Blog} from '@website/server-api';
import {useCallback, useState} from 'react';

export function useAbout() {
  const [loading, setLoading] = useState(false);

  const get = useCallback(async () => {
    setLoading(true);
    const response = await Blog.Option.getAbout();
    setLoading(false);
    return response;
  }, []);

  const set = useCallback(
    async (...params: Parameters<typeof Blog.Option.setAbout>) => {
      setLoading(true);
      const response = await Blog.Option.setAbout(...params);
      setLoading(false);
      return response;
    },
    [],
  );

  return {
    loading,
    get,
    set,
  };
}
