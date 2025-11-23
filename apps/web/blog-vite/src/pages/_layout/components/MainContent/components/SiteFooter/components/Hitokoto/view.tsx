import {SentenceCategory, useHitokoto} from '@library/hitokoto-hooks';
import {useMemo} from 'react';

export function Hitokoto() {
  const hitokotoCategories = useMemo(
    () => [
      SentenceCategory.ANIME,
      SentenceCategory.COMIC,
      SentenceCategory.GAME,
    ],
    [],
  );
  const {sentence} = useHitokoto(hitokotoCategories, '这里应该有一句话');
  return <div>{sentence}</div>;
}
