import {ModelAccessDeniedError} from '@website/model';
import {notification} from 'antd';
import {useEffect} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

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
      if (idToArticleError instanceof ModelAccessDeniedError) {
        notification.error({message: idToArticleError.message});
      } else {
        showNetworkError(idToArticleError);
      }
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
