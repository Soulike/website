'use client';

import type {Metadata} from 'next';

import {IndexView} from '@/src/app/(index)/View';
import {useArticlesWithAbstract} from '@/src/hooks/useArticlesWithAbstract';

export const metadata: Metadata = {
  title: 'Soulike 的博客',
};

export function Index() {
  const {loading, articlesWithAbstract} = useArticlesWithAbstract();

  return (
    <IndexView
      articlesWithAbstract={articlesWithAbstract ?? []}
      loading={loading}
    />
  );
}
