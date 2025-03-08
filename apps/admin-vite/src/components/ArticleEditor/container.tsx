import {Article, NewArticle} from '@website/classes';
import {ModelAccessDeniedError} from '@website/model';
import {notification} from 'antd';
import {useEffect} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {ArticleEditorView} from './view.js';
import {useViewModel} from './view-model.js';

export interface ArticleEditorProps {
  /**
   * @description If `articleId` is provided, the content of the article will be loaded.
   */
  articleId?: Article['id'];
  submitting: boolean;
  onSubmitButtonClick: (newArticle: NewArticle) => void;
}

export function ArticleEditor(props: ArticleEditorProps) {
  const {articleId, submitting, onSubmitButtonClick} = props;

  const {
    disabled,
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
    articlePreviewModal,
  } = useViewModel(articleId);

  useEffect(() => {
    if (articleLoadError) {
      if (articleLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: articleLoadError.message});
      } else {
        showNetworkError(articleLoadError);
      }
    }

    if (categoriesLoadError) {
      if (categoriesLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: categoriesLoadError.message});
      } else {
        showNetworkError(categoriesLoadError);
      }
    }
  }, [articleLoadError, categoriesLoadError]);

  return (
    <>
      <ArticleEditorView
        disabled={disabled}
        title={title}
        content={content}
        selectedCategory={selectedCategory}
        isVisible={isVisibleChecked}
        categoryOption={categories}
        onTitleInputChange={onTitleInputChange}
        onContentTextAreaChange={onContentInputChange}
        onCategorySelectorChange={onCategorySelectChange}
        onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
        onSubmitButtonClick={onSubmitButtonClick}
        onPreviewButtonClick={showArticlePreviewModal}
        isLoadingCategory={categoriesLoading}
        isLoadingArticle={articleLoading}
        isSubmittingArticle={submitting}
      />
      {articlePreviewModal}
    </>
  );
}
