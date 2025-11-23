import {Article} from '@module/classes';
import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleEditorView, ArticleEditorViewProps} from './view.js';
import {useViewModel} from './view-model.js';

export interface ArticleEditorProps {
  /**
   * @description If `articleId` is provided, the content of the article will be loaded.
   */
  articleId?: Article['id'];
  submitting: boolean;
  onSubmitButtonClick: ArticleEditorViewProps['onSubmitButtonClick'];
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
      showErrorNotification(articleLoadError);
    }

    if (categoriesLoadError) {
      showErrorNotification(categoriesLoadError);
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
        categories={categories}
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
