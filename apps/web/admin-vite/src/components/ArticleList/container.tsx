import {type Article} from '@schema/blog';
import {useCallback, useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleListView} from './view.js';
import {useViewModel} from './view-model.js';

interface IProps {
  category?: number; // 限定文章的分类
  onArticleDeleted?: (id: Article['id']) => void;
}

export function ArticleList(props: IProps) {
  const {category, onArticleDeleted} = props;

  const {
    idToArticle,
    idToArticleLoading,
    idToArticleError,
    handleDeleteArticleSuccess,
  } = useViewModel(category);

  const handleArticleDeleted = useCallback(
    (id: Article['id']) => {
      handleDeleteArticleSuccess(id);
      onArticleDeleted?.(id);
    },
    [handleDeleteArticleSuccess, onArticleDeleted],
  );

  useEffect(() => {
    if (idToArticleError) {
      showErrorNotification(idToArticleError);
    }
  }, [idToArticleError]);

  return (
    <ArticleListView
      loading={idToArticleLoading}
      idToArticle={idToArticle ?? new Map()}
      onDeleteArticleSuccess={handleArticleDeleted}
    />
  );
}
