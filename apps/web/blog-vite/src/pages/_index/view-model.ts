import {ArticleModelHooks} from '@module/model/react/blog';

import {STRING_KEY, useI18nString} from '@/i18n/index.js';

export function useViewModel() {
  const {
    articles: articlesWithAbstract,
    loading: articlesWithAbstractLoading,
    error: articlesWithAbstractError,
  } = ArticleModelHooks.useAllArticlesWithAbstract();
  const pageTitle = useI18nString(STRING_KEY.PAGE_TITLE_INDEX);

  return {
    pageTitle,
    articlesWithAbstract,
    articlesWithAbstractLoading,
    articlesWithAbstractError,
  };
}
