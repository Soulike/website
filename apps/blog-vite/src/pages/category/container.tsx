import {useEffect} from 'react';

import {ArticleList} from '@/components/ArticleList';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {useViewModel} from './view-model.js';

export function Category() {
  const {
    articlesWithAbstractLoadError,
    articlesWithAbstractLoading,
    articlesWithAbstract,
  } = useViewModel();

  useEffect(() => {
    if (articlesWithAbstractLoadError) {
      showErrorNotification(articlesWithAbstractLoadError);
    }
  }, [articlesWithAbstractLoadError]);

  return (
    <ArticleList
      articles={articlesWithAbstract ?? []}
      loading={articlesWithAbstractLoading}
    />
  );
}
