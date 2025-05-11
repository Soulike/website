import {Article as ArticleClass, Category} from '@website/classes';
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

  const placeholderArticle = useMemo(() => {
    return new ArticleClass(0, '', '', 0, '0', '0', 0, true);
  }, []);

  const placeholderCategory = useMemo(() => {
    return new Category(0, '');
  }, []);

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
