import {RejectCallback, ResolveCallback, usePromise} from '@library/hooks';
import {Article, Category} from '@module/classes';
import {useMemo} from 'react';

import {articleModel} from '../../models/blog/index.js';

export const ArticleModelHooks = {
  useAllArticlesWithAbstract,
  useArticleById,
  useArticlesByCategory,
  useAllArticlesWithAbstractByCategory,
};

function useAllArticlesWithAbstract(
  onSuccess?: ResolveCallback<Article[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => articleModel.getAllWithAbstract(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    articles: resolvedValue,
  };
}

function useAllArticlesWithAbstractByCategory(
  categoryId: Category['id'],
  onSuccess?: ResolveCallback<Article[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () => articleModel.getByCategoryWithAbstract(categoryId),
    [categoryId],
  );
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    articles: resolvedValue,
  };
}

function useArticleById(
  id: Article['id'],
  onSuccess?: ResolveCallback<Article>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => articleModel.getById(id), [id]);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );
  return {
    loading: pending,
    error: rejectedError,
    article: resolvedValue,
  };
}

function useArticlesByCategory(
  category: Article['category'],
  onSuccess?: ResolveCallback<Article[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () => articleModel.getByCategoryWithAbstract(category),
    [category],
  );
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    articles: resolvedValue,
  };
}
