import {useEffect, useState} from 'react';

import {Hitokoto} from '@/src/apis/third-party';

export function useHitokoto(): string {
  const [hitokoto, setHitokoto] = useState('这里应该有一句话');

  useEffect(() => {
    void Hitokoto.getPlainTextFromAnimationCategory()
      .then((hitokoto) => {
        if (hitokoto) {
          setHitokoto(hitokoto);
        }
      })
      .catch((e: unknown) => {
        console.error(e);
      });
  }, []);

  return hitokoto;
}
