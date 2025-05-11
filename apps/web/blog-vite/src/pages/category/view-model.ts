import {Category} from '@website/classes';
import {useLazyPromise} from '@website/hooks';
import {articleModel} from '@website/model/blog';
import {useEffect} from 'react';
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
  const {run, pending, resolvedValue, rejectedError} = useLazyPromise(
    (id: Category['id']) => articleModel.getByCategoryWithAbstract(id),
  );

  return {
    loading: pending,
    error: rejectedError,
    loadArticlesByCategoryWithAbstract: run,
    articlesWithAbstract: resolvedValue,
  };
}
