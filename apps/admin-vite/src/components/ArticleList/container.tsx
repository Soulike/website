import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleListView} from './view.js';
import {useViewModel} from './view-model.js';

interface IProps {
  category?: number; // 限定文章的分类
}

export function ArticleList(props: IProps) {
  const {category} = props;

  const {
    idToArticle,
    idToArticleLoading,
    idToArticleError,
    handleDeleteArticleSuccess,
  } = useViewModel(category);

  useEffect(() => {
    if (idToArticleError) {
      showErrorNotification(idToArticleError);
    }
  }, [idToArticleError]);

  return (
    <ArticleListView
      loading={idToArticleLoading}
      idToArticle={idToArticle ?? new Map()}
      onDeleteArticleSuccess={handleDeleteArticleSuccess}
    />
  );
}
