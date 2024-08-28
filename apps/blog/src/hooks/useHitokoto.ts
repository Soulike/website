import {useEffect, useState} from 'react';

export function useHitokoto(): string {
  const [hitokoto, setHitokoto] = useState('这里应该有一句话');

  useEffect(() => {
    const urlSearchParams = new URLSearchParams({
      c: 'a',
      encode: 'text',
    });
    const url = new URL(`https://v1.hitokoto.cn`);
    for (const [name, value] of urlSearchParams) {
      url.searchParams.append(name, value);
    }

    const getHitokoto = async () => {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        mode: 'no-cors',
        credentials: 'omit',
      });
      return response.text();
    };

    void getHitokoto()
      .then((hitokoto) => {
        if (hitokoto) {
          setHitokoto(hitokoto);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return hitokoto;
}
