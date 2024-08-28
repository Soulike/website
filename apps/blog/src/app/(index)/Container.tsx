'use client';

import {IndexView} from '@/src/app/(index)/View';
import {useArticlesWithAbstract} from '@/src/hooks/useArticlesWithAbstract';

export function Index() {
  const {loading, articlesWithAbstract} = useArticlesWithAbstract();

  document.title = 'Soulike 的博客';

  return (
    <IndexView
      articlesWithAbstract={articlesWithAbstract ?? []}
      loading={loading}
    />
  );
}
