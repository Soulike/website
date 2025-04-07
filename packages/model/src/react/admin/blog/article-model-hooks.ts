import assert from 'node:assert';

import {Article} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useEffect, useMemo, useState} from 'react';

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

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      if (onReject) {
        void onReject(error);
      }
      return;
    }

    assert(articles);
    const idToCategory = new Map<Article['id'], Article>();
    for (const article of articles) {
      idToCategory.set(article.id, article);
    }
    setIdToArticle(idToCategory);
    if (onSuccess) {
      void onSuccess(idToCategory);
    }
  }, [loading, error, onReject, articles, onSuccess]);

  return {
    loading,
    error,
    idToArticle,
  };
}
