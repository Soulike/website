import assert from 'node:assert';

import {ModelAccessDeniedError} from '@website/model';
import {type ButtonProps, notification} from 'antd';
import {useEffect} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {ModifyView} from './view.js';
import {useViewModel} from './view-model.js';

export function Modify() {
  const {
    articleLoading,
    articleLoadError,
    categories,
    categoriesLoading,
    categoriesLoadError,
    title,
    onTitleInputChange,
    content,
    onContentInputChange,
    selectedCategory,
    onCategorySelectChange,
    isVisibleChecked,
    onIsVisibleCheckboxChange,
    showArticlePreviewModal,
    hideArticlePreviewModal,
    articlePreviewModalVisible,
    modifyingArticleId,
    isSubmittingArticleModification,
    handleArticleModificationSubmit,
  } = useViewModel();

  useEffect(() => {
    if (categoriesLoadError) {
      if (categoriesLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: categoriesLoadError.message});
      } else {
        showNetworkError(categoriesLoadError);
      }
    }

    if (articleLoadError) {
      if (articleLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: articleLoadError.message});
      } else {
        showNetworkError(articleLoadError);
      }
    }
  }, [articleLoadError, categoriesLoadError]);

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    assert(modifyingArticleId !== null);
    handleArticleModificationSubmit(
      modifyingArticleId,
      title,
      content,
      selectedCategory,
      isVisibleChecked,
      (message: string) => {
        notification.error({message});
      },
      () => {
        notification.success({message: 'Article modified'});
      },
      (error) => {
        if (error instanceof ModelAccessDeniedError) {
          notification.error({message: error.message});
        } else {
          showNetworkError(error);
        }
      },
    );
  };

  return (
    <ModifyView
      title={title}
      content={content}
      selectedCategory={selectedCategory}
      categoryOption={categories ?? []}
      isLoadingCategory={categoriesLoading}
      isLoadingArticle={articleLoading}
      isSubmittingArticle={isSubmittingArticleModification}
      isVisible={isVisibleChecked}
      onArticlePreviewButtonClick={showArticlePreviewModal}
      onArticlePreviewModalOk={hideArticlePreviewModal}
      onArticlePreviewModalCancel={hideArticlePreviewModal}
      isArticlePreviewModalOpen={articlePreviewModalVisible}
      onSubmitButtonClick={onSubmitButtonClick}
      onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
      onCategorySelectorChange={onCategorySelectChange}
      onContentTextAreaChange={onContentInputChange}
      onTitleInputChange={onTitleInputChange}
    />
  );
}
