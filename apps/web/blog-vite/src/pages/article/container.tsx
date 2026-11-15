import {type Article as ArticleType, type Category} from '@schema/blog';
import {useEffect, useMemo} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleView} from './view.js';
import {useViewModel} from './view-model.js';

export function Article() {
  const {
    pageTitle,
    article,
    articleLoading,
    articleLoadError,
    category,
    categoryLoading,
    categoryLoadError,
    shouldShowOutdatedMessage,
    outdatedWarningMessage,
  } = useViewModel();

  const placeholderArticle = useMemo<ArticleType>(
    () => ({
      id: 0,
      title: '',
      content: '',
      category: 0,
      publicationTime: '0',
      modificationTime: '0',
      pageViews: 0,
      isVisible: true,
    }),
    [],
  );

  const placeholderCategory = useMemo<Category>(
    () => ({
      id: 0,
      name: '',
    }),
    [],
  );

  useEffect(() => {
    if (articleLoadError) {
      showErrorNotification(articleLoadError);
    }
    if (categoryLoadError) {
      showErrorNotification(categoryLoadError);
    }
  }, [articleLoadError, categoryLoadError]);

  return (
    <>
      <title>{pageTitle}</title>
      <ArticleView
        article={article ?? placeholderArticle}
        category={category ?? placeholderCategory}
        loading={articleLoading || categoryLoading}
        shouldShowOutdatedWarningMessage={shouldShowOutdatedMessage}
        outdatedWarningMessage={outdatedWarningMessage}
      />
    </>
  );
}
