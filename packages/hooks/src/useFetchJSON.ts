import {useEffect, useState} from 'react';

import {useFetch} from './useFetch';

export function useFetchJSON<ResT>(...params: Parameters<typeof fetch>) {
  const {loading, response, error} = useFetch(...params);

  const [data, setData] = useState<ResT | null>(null);
  const [loadingJSON, setLoadingJSON] = useState(false);
  const [loadingJSONError, setLoadingJSONError] = useState<unknown | null>(
    null,
  );

  useEffect(() => {
    if (response) {
      setLoadingJSON(true);
      const promise = response.json();
      promise.then((data) => {
        setData(data);
      });
      promise.catch((err) => {
        setLoadingJSONError(err);
      });
      promise.finally(() => {
        setLoadingJSON(false);
      });
    }
  }, [response]);

  return {
    loading: loading || loadingJSON,
    error: error ?? loadingJSONError,
    data,
  };
}
