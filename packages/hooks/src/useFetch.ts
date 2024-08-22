import {useEffect, useState} from 'react';

export function useFetch(...params: Parameters<typeof fetch>) {
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchPromise = fetch(...params);
    fetchPromise.then((response) => {
      setResponse(response);
    });

    fetchPromise.catch((err) => {
      setError(err);
    });

    fetchPromise.finally(() => {
      setLoading(false);
    });
  }, [params]);

  return {response, loading, error};
}
