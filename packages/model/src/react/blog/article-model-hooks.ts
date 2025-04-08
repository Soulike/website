import {ArticleModel} from '@models/blog/article-model.js';
import {Article} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useMemo} from 'react';

export const ArticleModelHooks = {
  useAllArticlesWithAbstract,
  useArticleById,
  useArticlesByCategory,
};

const articleModel = new ArticleModel();

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
