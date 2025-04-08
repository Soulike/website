import {Article} from '@website/classes';
import {ArticleModelHooks} from '@website/model/react/blog';

export function useViewModel(): {
  articlesWithAbstract: Article[] | null;
  articlesWithAbstractLoading: boolean;
  articlesWithAbstractError: Error | null;
} {
  const {
    articles: articlesWithAbstract,
    loading: articlesWithAbstractLoading,
    error: articlesWithAbstractError,
  } = ArticleModelHooks.useAllArticlesWithAbstract();

  return {
    articlesWithAbstract,
    articlesWithAbstractLoading,
    articlesWithAbstractError,
  };
}
