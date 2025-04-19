import assert from 'node:assert';

import {Article, Category} from '@website/classes';
import {articleModel} from '@website/model/blog';
import {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';
import {CategoryPathParams} from '@/router/page-config/page-path-params.js';

export function useViewModel() {
  const {
    loading: articlesWithAbstractLoading,
    error: articlesWithAbstractLoadError,
    loadArticlesByCategoryWithAbstract,
    articlesWithAbstract,
  } = useLoadArticlesByCategoryWithAbstract();
  const {id} = useParams<keyof CategoryPathParams>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.INDEX]);
      return;
    }
    const categoryId = Number.parseInt(id);
    if (Number.isNaN(categoryId)) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.INDEX]);
      return;
    }
    loadArticlesByCategoryWithAbstract(categoryId);
  }, [id, loadArticlesByCategoryWithAbstract, navigate]);

  return {
    articlesWithAbstractLoading,
    articlesWithAbstractLoadError,
    articlesWithAbstract,
  };
}

function useLoadArticlesByCategoryWithAbstract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [articlesWithAbstract, setArticlesWithAbstract] = useState<
    Article[] | null
  >(null);

  const loadArticlesByCategoryWithAbstract = useCallback(
    (categoryId: Category['id']) => {
      setLoading(true);
      articleModel
        .getByCategoryWithAbstract(categoryId)
        .then((articles) => {
          setArticlesWithAbstract(articles);
        })
        .catch((e: unknown) => {
          assert(e instanceof Error);
          setError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  return {
    loading,
    error,
    loadArticlesByCategoryWithAbstract,
    articlesWithAbstract,
  };
}
