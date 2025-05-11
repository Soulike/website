import {STRING_KEY, useI18nString} from '@website/i18n';
import {ArticleModelHooks} from '@website/model/react/blog';

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
