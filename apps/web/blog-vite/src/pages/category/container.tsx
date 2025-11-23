import {STRING_KEY, useI18nString} from '@website/blog-i18n';
import {useEffect} from 'react';

import {ArticleList} from '@/components/ArticleList';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {useViewModel} from './view-model.js';

export function Category() {
  const title = useI18nString(STRING_KEY.PAGE_TITLE_INDEX);
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
    <>
      <title>{title}</title>
      <ArticleList
        articles={articlesWithAbstract ?? []}
        loading={articlesWithAbstractLoading}
      />
    </>
  );
}
