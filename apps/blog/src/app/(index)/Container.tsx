import type {Metadata} from 'next';

import {IndexView} from '@/src/app/(index)/View';

import {IndexViewModel} from './IndexViewModel';

export const metadata: Metadata = {
  title: 'Soulike 的博客',
};

export async function Index() {
  const articlesWithAbstract = await IndexViewModel.getArticlesWithAbstract();

  return (
    <IndexView articlesWithAbstract={articlesWithAbstract} loading={false} />
  );
}
