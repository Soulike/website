import {Article} from '@module/classes';
import {BlogModelHooks} from '@module/model/react/admin';
import {useCallback, useEffect, useState} from 'react';

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
        idToArticleCache.delete(id);
        setIdToArticleCache(new Map(idToArticleCache));
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
  // Maintain a cached version for quick refresh
  const [idToArticleCache, setIdToArticleCache] = useState<Map<
    Article['id'],
    Article
  > | null>(null);
  const {
    loading: idToArticleLoading,
    idToArticle,
    error: idToArticleError,
  } = BlogModelHooks.ArticleModelHooks.useIdToArticle(category);
  useEffect(() => {
    if (!idToArticleLoading && !idToArticleError) {
      setIdToArticleCache(idToArticle);
    }
  }, [idToArticle, idToArticleError, idToArticleLoading]);

  return {
    idToArticleCache,
    setIdToArticleCache,
    idToArticleLoading,
    idToArticleError,
  };
}
