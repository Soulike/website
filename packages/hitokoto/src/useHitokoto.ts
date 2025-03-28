import {useEffect, useState} from 'react';

import {hitokoto} from './hitokoto.js';
import {SentenceCategory} from './v1/types.js';

export function useHitokoto(
  categories: SentenceCategory[],
  placeholder: string,
  deps: unknown[],
) {
  const [sentence, setSentence] = useState(placeholder);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    hitokoto
      .getSentence(categories)
      .then((sentence) => {
        setSentence(sentence);
      })
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categories, deps, ...deps]);

  return {
    loading,
    sentence,
  };
}
