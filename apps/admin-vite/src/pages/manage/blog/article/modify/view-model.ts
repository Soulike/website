import assert from 'node:assert';

import {Article, NewArticle} from '@website/classes';
import {
  useAntdCheckbox,
  useAntdSelect,
  useModal,
  useTextInput,
} from '@website/hooks';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

export function useViewModel() {
  const modifyingArticleId = useSearchParameterId();
  const navigate = useNavigate();
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleLoadError, setArticleLoadError] = useState<Error | null>(null);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesLoadError,
  } = BlogModelHooks.CategoryModelHooks.useAllCategories();
  const {
    value: title,
    setValue: setTitle,
    resetValue: resetTitleInput,
    onChange: onTitleInputChange,
  } = useTextInput();
  const {
    value: content,
    setValue: setContent,
    resetValue: resetContentInput,
    onChange: onContentInputChange,
  } = useTextInput();
  const {
    value: selectedCategory,
    setValue: setSelectedCategory,
    onChange: onCategorySelectChange,
    resetValue: resetCategorySelect,
  } = useAntdSelect<number>();
  const {
    checked: isVisibleChecked,
    setChecked: setIsVisibleChecked,
    resetValue: resetIsVisibleCheckbox,
    onChange: onIsVisibleCheckboxChange,
  } = useAntdCheckbox();
  const {
    show: showArticlePreviewModal,
    hide: hideArticlePreviewModal,
    visible: articlePreviewModalVisible,
  } = useModal();

  const {isSubmittingArticleModification, handleArticleModificationSubmit} =
    useSubmitArticleModification(() => {
      resetTitleInput();
      resetContentInput();
      resetCategorySelect();
      resetIsVisibleCheckbox();
    });

  useEffect(() => {
    if (!modifyingArticleId) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.INDEX], {replace: true});
      return;
    }
    setArticleLoading(true);
    articleModel
      .getById(modifyingArticleId)
      .then((article) => {
        const {title, content, category, isVisible} = article;
        setTitle(title);
        setContent(content);
        setSelectedCategory(category);
        setIsVisibleChecked(isVisible);
      })
      .catch((error: unknown) => {
        assert(error instanceof Error);
        setArticleLoadError(error);
      })
      .finally(() => {
        setArticleLoading(false);
      });
  }, [
    articleModel,
    modifyingArticleId,
    navigate,
    setContent,
    setIsVisibleChecked,
    setSelectedCategory,
    setTitle,
  ]);

  return {
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
  };
}

function useSearchParameterId(): Article['id'] | null {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  if (id === null) {
    return null;
  }
  return Number.parseInt(id);
}

export function useSubmitArticleModification(afterSubmitSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);

  const handleArticleModificationSubmit = useCallback(
    (
      id: Article['id'],
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

      setIsSubmitting(true);
      articleModel
        .modify(id, {title, content, category: selectedCategory, isVisible})
        .then(() => {
          onSubmitSuccess();
          afterSubmitSuccess();
        })
        .catch((e: unknown) => {
          assert(e instanceof Error);
          onSubmitFailed(e);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [afterSubmitSuccess, articleModel],
  );

  return {
    isSubmittingArticleModification: isSubmitting,
    handleArticleModificationSubmit,
  };
}
