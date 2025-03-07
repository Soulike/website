import assert from 'node:assert';

import {Article, Category, NewArticle} from '@website/classes';
import {
  useAntdCheckbox,
  useAntdSelect,
  useModal,
  useTextInput,
} from '@website/hooks';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
import {useCallback, useMemo, useState} from 'react';

export function useViewModel() {
  const {
    value: title,
    onChange: onTitleInputChange,
    resetValue: resetTitleInput,
  } = useTextInput();
  const {
    value: content,
    onChange: onContentTextAreaChange,
    resetValue: resetContentInput,
  } = useTextInput();
  const {
    value: selectedCategory,
    onChange: onCategorySelectChange,
    resetValue: resetCategorySelect,
  } = useAntdSelect<Category['id']>();
  const {
    checked: isVisibleChecked,
    onChange: onIsVisibleCheckboxChange,
    resetValue: resetIsVisibleCheckbox,
  } = useAntdCheckbox(true);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesLoadError,
  } = BlogModelHooks.CategoryModelHooks.useAllCategories();

  const {
    show: showArticlePreviewModal,
    hide: hideArticlePreviewModal,
    visible: articlePreviewModalVisible,
  } = useModal();

  const afterArticleSubmitSuccess = useCallback(() => {
    resetTitleInput();
    resetContentInput();
    resetCategorySelect();
    resetIsVisibleCheckbox();
  }, [
    resetCategorySelect,
    resetContentInput,
    resetIsVisibleCheckbox,
    resetTitleInput,
  ]);
  const {isSubmittingArticle, handleArticleSubmit} = useSubmitArticle(
    afterArticleSubmitSuccess,
  );

  return {
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
    isSubmittingArticle,
    handleArticleSubmit,
  };
}

export function useSubmitArticle(afterSubmitSuccess: () => void) {
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);

  const handleArticleSubmit = useCallback(
    (
      title: Article['title'],
      content: Article['content'],
      selectedCategory: Article['category'] | null,
      isVisible: Article['isVisible'],
      onValidationFailed: (message: string) => void,
      onSubmitSuccess: () => void,
      onSubmitFailed: (error: Error) => void,
    ) => {
      const validationPassed = NewArticle.validateFormInput(
        {
          title,
          content,
          category: selectedCategory,
          isVisible,
        },
        onValidationFailed,
      );
      if (!validationPassed) {
        return;
      }
      assert(selectedCategory !== null);

      setIsSubmittingArticle(true);
      articleModel
        .add(new NewArticle(selectedCategory, content, isVisible, title))
        .then(() => {
          onSubmitSuccess();
          afterSubmitSuccess();
        })
        .catch((e: unknown) => {
          assert(e instanceof Error);
          onSubmitFailed(e);
        })
        .finally(() => {
          setIsSubmittingArticle(false);
        });
    },
    [afterSubmitSuccess, articleModel],
  );

  return {
    isSubmittingArticle,
    handleArticleSubmit,
  };
}
