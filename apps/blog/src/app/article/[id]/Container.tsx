'use client';

import {Article as ArticleClass, Category} from '@website/classes';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo} from 'react';

import {useArticle} from '@/src/hooks/useArticle';
import {useCategory} from '@/src/hooks/useCategory';

import {ArticleView} from './View';

interface ArticleProps {
  params: ArticleDynamicParams;
}

interface ArticleDynamicParams {
  id: string;
}

export function Article({params}: ArticleProps) {
  const router = useRouter();
  const emptyArticle = useMemo(
    () => new ArticleClass(0, '', '', 0, '', '', 0, true),
    [],
  );
  const emptyCategory = useMemo(() => new Category(0, ''), []);

  const {id} = params;
  const articleId = Number.parseInt(id ?? '');

  const {loading: articleIsLoading, article} = useArticle(articleId);

  useEffect(() => {
    if (!articleIsLoading && article === null) {
      void router.replace('/');
    }
  }, [article, articleIsLoading, router]);

  const {loading: categoryIsLoading, category} = useCategory(
    article?.category ?? NaN,
  );

  const loading = useMemo(
    () => articleIsLoading || categoryIsLoading,
    [articleIsLoading, categoryIsLoading],
  );
  const {title, publicationTime, modificationTime} = useMemo(
    () => article ?? emptyArticle,
    [article, emptyArticle],
  );

  useEffect(() => {
    if (!loading) {
      document.title = `${title} - Soulike 的博客`;
    }
  }, [loading, title]);

  return (
    <ArticleView
      title={title}
      contentMarkdown={article?.content ?? ''}
      publicationTime={publicationTime}
      modificationTime={modificationTime}
      loading={loading}
      category={category ?? emptyCategory}
    />
  );
}
