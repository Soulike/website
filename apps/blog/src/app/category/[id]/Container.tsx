import {notFound} from 'next/navigation';

import {ArticleList} from '@/src/components/ArticleList';

import {CategoryViewModel} from './CategoryViewModel';

interface CategoryProps {
  params: CategoryDynamicParams;
}

interface CategoryDynamicParams {
  id: string;
}

export async function Category({params}: CategoryProps) {
  const {id} = params;
  const categoryId = Number.parseInt(id);
  if (Number.isNaN(categoryId)) {
    notFound();
  }

  try {
    const articlesWithAbstract =
      await CategoryViewModel.getArticlesWithAbstractByCategory(categoryId);
    return <ArticleList articleList={articlesWithAbstract} loading={false} />;
  } catch (e) {
    console.error(e);
    notFound();
  }
}
