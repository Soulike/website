import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {IndexView} from './view';
import {useViewModel} from './view-model';

export function Index() {
  const {
    articlesWithAbstractError,
    articlesWithAbstractLoading,
    articlesWithAbstract,
  } = useViewModel();

  useEffect(() => {
    if (articlesWithAbstractError) {
      showErrorNotification(articlesWithAbstractError);
    }
  }, [articlesWithAbstractError]);

  return (
    <IndexView
      articles={articlesWithAbstract ?? []}
      loading={articlesWithAbstractLoading}
    />
  );
}
