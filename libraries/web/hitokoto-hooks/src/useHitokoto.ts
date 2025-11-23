import {hitokoto, SentenceCategory} from '@website/hitokoto-base';
import {useEffect, useState} from 'react';

export function useHitokoto(
  categories: SentenceCategory[],
  placeholder: string,
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
  }, [categories]);

  return {
    loading,
    sentence,
  };
}
