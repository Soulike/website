import {BlogModelHooks} from '@module/model/react/admin';
import {type Article} from '@schema/blog';
import {useCallback, useState} from 'react';

export function useViewModel(category?: Article['category']) {
  const {
    idToArticleCache,
    idToArticleLoading,
    idToArticleError,
    updateIdToArticleCache,
  } = useIdToArticleCache(category);

  const handleDeleteArticleSuccess = useCallback(
    (id: Article['id']) => {
      updateIdToArticleCache((prev) => {
        if (!prev) {
          return prev;
        }
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    },
    [updateIdToArticleCache],
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

  const updateIdToArticleCache = useCallback(
    (
      updater: (
        prev: Map<Article['id'], Article> | null,
      ) => Map<Article['id'], Article> | null,
    ) => {
      setOverriddenState((prevOverride) => {
        const current =
          prevOverride !== null && prevOverride.source === idToArticle
            ? prevOverride.value
            : idToArticleError
              ? null
              : idToArticle;
        return {
          source: idToArticle,
          value: updater(current),
        };
      });
    },
    [idToArticle, idToArticleError],
  );

  return {
    idToArticleCache,
    updateIdToArticleCache,
    idToArticleLoading,
    idToArticleError,
  };
}
