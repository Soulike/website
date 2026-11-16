import {BlogModelHooks} from '@module/model/react/admin';
import {type Article} from '@schema/blog';
import {useCallback, useState} from 'react';

export function useViewModel(category?: Article['category']) {
  const {
    idToArticleCache,
    idToArticleLoading,
    idToArticleError,
    setIdToArticleCache,
  } = useIdToArticleCache(category);

  const handleDeleteArticleSuccess = useCallback(
    (id: Article['id']) => {
      if (idToArticleCache) {
        const next = new Map(idToArticleCache);
        next.delete(id);
        setIdToArticleCache(next);
      }
    },
    [idToArticleCache, setIdToArticleCache],
  );

  return {
    idToArticle: idToArticleCache,
    idToArticleLoading,
    idToArticleError,
    handleDeleteArticleSuccess,
  };
}

function useIdToArticleCache(category?: Article['category']) {
  const {
    loading: idToArticleLoading,
    idToArticle,
    error: idToArticleError,
  } = BlogModelHooks.ArticleModelHooks.useIdToArticle(category);
  const [overriddenState, setOverriddenState] = useState<{
    source: Map<Article['id'], Article> | null;
    value: Map<Article['id'], Article> | null;
  } | null>(null);

  const idToArticleCache =
    overriddenState !== null && overriddenState.source === idToArticle
      ? overriddenState.value
      : idToArticleError
        ? null
        : idToArticle;

  const setIdToArticleCache = useCallback(
    (value: Map<Article['id'], Article> | null) => {
      setOverriddenState({source: idToArticle, value});
    },
    [idToArticle],
  );

  return {
    idToArticleCache,
    setIdToArticleCache,
    idToArticleLoading,
    idToArticleError,
  };
}
