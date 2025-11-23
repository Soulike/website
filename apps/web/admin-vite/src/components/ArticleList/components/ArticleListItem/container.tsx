import {Article} from '@module/classes';
import {notification, PopconfirmProps} from 'antd';
import {useCallback, useMemo} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleListItemView} from './view.js';
import {useViewModel} from './view-model.js';

export interface ArticleListItemProps {
  id: Article['id'];
  onDeleteArticleSuccess: (id: Article['id']) => void;
}

export function ArticleListItem(props: ArticleListItemProps) {
  const {id, onDeleteArticleSuccess} = props;
  const {
    article,
    articleLoading,
    articleLoadError,
    category,
    categoryLoading,
    categoryLoadError,
    isVisibleChecked,
    onIsVisibleSwitchChange,
    handleModifyArticleButtonClick,
    articleDeleting,
    deleteArticle,
    handleTitleClick,
    articlePreviewModal,
  } = useViewModel(id);

  const loading = useMemo(
    () => articleLoading || categoryLoading || articleDeleting,
    [articleDeleting, articleLoading, categoryLoading],
  );

  const locked = useMemo(
    () => loading || !!articleLoadError || !!categoryLoadError,
    [articleLoadError, categoryLoadError, loading],
  );

  const onDeleteArticleConfirm: PopconfirmProps['onConfirm'] =
    useCallback(() => {
      deleteArticle(
        id,
        () => {
          notification.success({
            message: 'Article deleted',
          });
          onDeleteArticleSuccess(id);
        },
        (error) => {
          showErrorNotification(error);
        },
      );
    }, [deleteArticle, id, onDeleteArticleSuccess]);

  return (
    <>
      <ArticleListItemView
        loading={loading}
        locked={locked}
        id={id}
        title={article?.title ?? '...'}
        publicationTime={new Date(article?.publicationTime ?? 0)}
        modificationTime={new Date(article?.modificationTime ?? 0)}
        categoryName={category?.name ?? '...'}
        onTitleClick={handleTitleClick}
        isVisibleSwitchChecked={isVisibleChecked}
        onIsVisibleSwitchChange={onIsVisibleSwitchChange}
        onModifyButtonClick={handleModifyArticleButtonClick}
        onDeleteArticleConfirm={onDeleteArticleConfirm}
      />
      {articlePreviewModal}
    </>
  );
}
