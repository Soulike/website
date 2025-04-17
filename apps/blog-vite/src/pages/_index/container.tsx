import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {IndexView} from './view';
import {useViewModel} from './view-model';

export function Index() {
  const {
    pageTitle,
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
    <>
      <title>{pageTitle}</title>
      <IndexView
        articles={articlesWithAbstract ?? []}
        loading={articlesWithAbstractLoading}
      />
    </>
  );
}
