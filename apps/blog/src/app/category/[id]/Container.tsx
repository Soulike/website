'use client';

import {AntdWrapper} from '@/src/components/AntdWrapper';
import {IndexArticleList} from '@/src/components/IndexArticleList';
import {useArticlesWithAbstract} from '@/src/hooks/useArticlesWithAbstract';

interface CategoryProps {
  params: CategoryDynamicParams;
}

interface CategoryDynamicParams {
  id: string;
}

export function Category({params}: CategoryProps) {
  const {id} = params;
  const categoryId = Number.parseInt(id ?? '');

  document.title = 'Soulike 的博客';

  const {loading, articlesWithAbstract} = useArticlesWithAbstract(categoryId);

  return (
    <AntdWrapper>
      <IndexArticleList
        articleList={articlesWithAbstract ?? []}
        loading={loading}
      />
    </AntdWrapper>
  );
}
