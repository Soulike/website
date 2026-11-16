import {RejectCallback, ResolveCallback, usePromise} from '@library/hooks';
import {type Article} from '@schema/blog';
import {useMemo} from 'react';

import {ArticleModel} from '../../../models/admin/blog/article-model.js';

export const ArticleModelHooks = {
  useArticles,
  useArticleById,
  useIdToArticle,
};

const articleModel = new ArticleModel();

function useArticles(
  category?: Article['category'],
  onSuccess?: ResolveCallback<Article[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () =>
      category === undefined
        ? articleModel.getAll()
        : articleModel.getByCategory(category),
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

function buildIdToArticleMap(
  articles: readonly Article[],
): Map<Article['id'], Article> {
  const idToArticle = new Map<Article['id'], Article>();
  for (const article of articles) {
    idToArticle.set(article.id, article);
  }
  return idToArticle;
}

function useIdToArticle(
  category?: Article['category'],
  onSuccess?: ResolveCallback<Map<Article['id'], Article>>,
  onReject?: RejectCallback,
) {
  const {loading, error, articles} = useArticles(
    category,
    onSuccess
      ? (loadedArticles) => onSuccess(buildIdToArticleMap(loadedArticles))
      : undefined,
    onReject,
  );

  const idToArticle = useMemo(
    () => (articles ? buildIdToArticleMap(articles) : null),
    [articles],
  );

  return {
    loading,
    error,
    idToArticle,
  };
}
