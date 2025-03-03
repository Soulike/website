import {Article} from '@website/classes';
import {ModelAccessDeniedError} from '@website/model';
import {type ButtonProps, notification, type PopconfirmProps} from 'antd';
import {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {ArticleListView} from './view.js';
import {useViewModel} from './view-model.js';

interface IProps {
  category?: number; // 限定文章的分类
}

export function ArticleList(props: IProps) {
  const {category} = props;

  const navigate = useNavigate();

  const {
    idToCategory,
    idToCategoryLoading,
    idToCategoryError,
    idToArticle,
    idToArticleLoading,
    idToArticleError,
    articlePreviewModalVisible,
    hideArticlePreviewModal,
    articlePreviewModalTitle,
    articlePreviewModalContentInMarkdown,
    processingArticleId,
    isVisibleSwitchClickHandlerFactory,
    articleTitleClickHandlerFactory,
    deleteArticlePending,
    handleDeleteArticleConfirm,
    deleteArticleButtonClickHandlerFactory,
  } = useViewModel(category);

  useEffect(() => {
    if (idToCategoryError) {
      if (idToCategoryError instanceof ModelAccessDeniedError) {
        notification.error({message: idToCategoryError.message});
      } else {
        showNetworkError(idToCategoryError);
      }
    }

    if (idToArticleError) {
      if (idToArticleError instanceof ModelAccessDeniedError) {
        notification.error({message: idToArticleError.message});
      } else {
        showNetworkError(idToArticleError);
      }
    }
  }, [idToArticleError, idToCategoryError]);

  const onIsVisibleSwitchClick = useCallback(
    (id: Article['id']) =>
      isVisibleSwitchClickHandlerFactory(id, undefined, (error) => {
        if (error instanceof ModelAccessDeniedError) {
          notification.error({message: error.message});
        } else {
          showNetworkError(error);
        }
      }),
    [isVisibleSwitchClickHandlerFactory],
  );

  const onModifyArticleButtonClick: (id: number) => ButtonProps['onClick'] =
    useCallback(
      (id: number) => {
        return (e) => {
          e.preventDefault();
          const urlSearchParams = new URLSearchParams();
          urlSearchParams.set('id', id.toString());
          void navigate(
            `${
              PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]
            }?${urlSearchParams.toString()}`,
          );
        };
      },
      [navigate],
    );

  const onDeleteArticleConfirm: PopconfirmProps['onConfirm'] =
    useCallback(() => {
      handleDeleteArticleConfirm(
        () => {
          notification.success({
            message: 'Article deleted',
          });
        },
        (error) => {
          if (error instanceof ModelAccessDeniedError) {
            notification.error({message: error.message});
          } else {
            showNetworkError(error);
          }
        },
      );
    }, [handleDeleteArticleConfirm]);

  return (
    <ArticleListView
      isLoading={
        idToCategoryLoading || idToArticleLoading || deleteArticlePending
      }
      idToArticle={idToArticle}
      idToCategory={idToCategory}
      modalIsOpen={articlePreviewModalVisible}
      articlePreviewModalTitle={articlePreviewModalTitle}
      articlePreviewModalContent={articlePreviewModalContentInMarkdown}
      modalOnOk={hideArticlePreviewModal}
      modalOnCancel={hideArticlePreviewModal}
      processingArticleId={processingArticleId}
      articleTitleClickHandlerFactory={articleTitleClickHandlerFactory}
      onIsVisibleSwitchClick={onIsVisibleSwitchClick}
      onModifyArticleButtonClick={onModifyArticleButtonClick}
      deleteArticleButtonClickHandlerFactory={
        deleteArticleButtonClickHandlerFactory
      }
      onDeleteArticleConfirm={onDeleteArticleConfirm}
    />
  );
}
