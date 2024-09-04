'use client';

import {useEffect} from 'react';

import {ArticleList} from '@/src/components/ArticleList';
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

  useEffect(() => {
    document.title = 'Soulike 的博客';
  }, []);

  const {loading, articlesWithAbstract} = useArticlesWithAbstract(categoryId);

  return (
    <ArticleList articleList={articlesWithAbstract ?? []} loading={loading} />
  );
}
