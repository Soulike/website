import {IndexView} from '@/src/app/(index)/View';

import {IndexViewModel} from './IndexViewModel';

export async function Index() {
  const articlesWithAbstract = await IndexViewModel.getArticlesWithAbstract();

  return (
    <IndexView articlesWithAbstract={articlesWithAbstract} loading={false} />
  );
}
