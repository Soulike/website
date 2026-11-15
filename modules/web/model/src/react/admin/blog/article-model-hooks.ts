import assert from 'node:assert';

import {RejectCallback, ResolveCallback, usePromise} from '@library/hooks';
import {type Article} from '@schema/blog';
import {useEffect, useEffectEvent, useMemo, useState} from 'react';

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

function useIdToArticle(
  category?: Article['category'],
  onSuccess?: ResolveCallback<Map<Article['id'], Article>>,
  onReject?: RejectCallback,
) {
  const {loading, error, articles} = useArticles(category);
  const [idToArticle, setIdToArticle] = useState<Map<
    Article['id'],
    Article
  > | null>(null);
  const handleSuccess = useEffectEvent(
    (articleMap: Map<Article['id'], Article>) => {
      void onSuccess?.(articleMap);
    },
  );
  const handleReject = useEffectEvent((rejectedError: Error) => {
    void onReject?.(rejectedError);
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      handleReject(error);
      return;
    }

    assert(articles);
    const idToArticleMap = new Map<Article['id'], Article>();
    for (const article of articles) {
      idToArticleMap.set(article.id, article);
    }
    setIdToArticle(idToArticleMap);
    handleSuccess(idToArticleMap);
  }, [loading, error, articles]);

  return {
    loading,
    error,
    idToArticle,
  };
}
