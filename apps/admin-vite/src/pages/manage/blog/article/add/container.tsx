import {ModelAccessDeniedError} from '@website/model';
import {type ButtonProps, notification} from 'antd';
import {useEffect} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {AddView} from './view.js';
import {useViewModel} from './view-model.js';

export function Add() {
  const {
    categories,
    categoriesLoading,
    categoriesLoadError,
    title,
    onTitleInputChange,
    content,
    onContentTextAreaChange,
    selectedCategory,
    onCategorySelectChange,
    isVisibleChecked,
    onIsVisibleCheckboxChange,
    articlePreviewModalVisible,
    showArticlePreviewModal,
    hideArticlePreviewModal,
    handleArticleSubmit,
    isSubmittingArticle,
  } = useViewModel();

  useEffect(() => {
    if (!categoriesLoading && categoriesLoadError) {
      if (categoriesLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: categoriesLoadError.message});
      } else {
        showNetworkError(categoriesLoadError);
      }
    }
  }, [categoriesLoadError, categoriesLoading]);

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    handleArticleSubmit(
      title,
      content,
      selectedCategory,
      isVisibleChecked,
      (message) => {
        notification.error({message});
      },
      () => {
        notification.success({message: 'Submitted'});
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
    <AddView
      title={title}
      content={content}
      selectedCategory={selectedCategory}
      isVisible={isVisibleChecked}
      categoryOption={categories ?? []}
      onTitleInputChange={onTitleInputChange}
      onContentTextAreaChange={onContentTextAreaChange}
      onCategorySelectorChange={onCategorySelectChange}
      onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
      onSubmitButtonClick={onSubmitButtonClick}
      isLoadingCategory={categoriesLoading}
      isSubmittingArticle={isSubmittingArticle}
      isArticlePreviewModalOpen={articlePreviewModalVisible}
      onArticlePreviewButtonClick={showArticlePreviewModal}
      onArticlePreviewModalOk={hideArticlePreviewModal}
      onArticlePreviewModalCancel={hideArticlePreviewModal}
    />
  );
}
