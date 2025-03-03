import assert from 'node:assert';

import {Article} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useEffect, useState} from 'react';

import {ArticleModel} from '../../models/blog/article-model.js';

export const ArticleModelHooks = {
  useArticles,
  useIdToArticle,
};

const articleModel = new ArticleModel();

function useArticles(
  category?: Article['category'],
  onSuccess?: ResolveCallback<Article[]>,
  onReject?: RejectCallback,
) {
  const {pending, resolvedValue, rejectedError} = usePromise(
    category === undefined
      ? articleModel.getAll()
      : articleModel.getByCategory(category),
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    articles: resolvedValue,
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
