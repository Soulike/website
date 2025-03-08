import assert from 'node:assert';

import {Article} from '@website/classes';
import {useAntdCheckbox, useAntdSelect, useTextInput} from '@website/hooks';
import {BlogModels} from '@website/model';
import {BlogModelHooks} from '@website/model/react';
import {useEffect, useMemo, useState} from 'react';

import {useArticlePreviewModal} from '@/components/ArticlePreviewModal/index.js';

export function useViewModel(articleId?: Article['id']) {
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
    onChange: onTitleInputChange,
  } = useTextInput();
  const {
    value: content,
    setValue: setContent,
    onChange: onContentInputChange,
  } = useTextInput();
  const {
    value: selectedCategory,
    setValue: setSelectedCategory,
    onChange: onCategorySelectChange,
  } = useAntdSelect<number>();
  const {
    checked: isVisibleChecked,
    setChecked: setIsVisibleChecked,
    onChange: onIsVisibleCheckboxChange,
  } = useAntdCheckbox();

  useEffect(() => {
    if (articleId === undefined) {
      return;
    }
    setArticleLoading(true);
    articleModel
      .getById(articleId)
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
    articleId,
    articleModel,
    setContent,
    setIsVisibleChecked,
    setSelectedCategory,
    setTitle,
  ]);

  const disabled = useMemo(
    () =>
      categoriesLoading ||
      articleLoading ||
      !!articleLoadError ||
      !!categoriesLoadError,
    [articleLoadError, articleLoading, categoriesLoadError, categoriesLoading],
  );

  const {
    show: showArticlePreviewModal,
    setTitle: setArticlePreviewModalTitle,
    setContentMarkdown: setArticlePreviewModalContentMarkdown,
    visible: articlePreviewModalVisible,
    modal: articlePreviewModal,
  } = useArticlePreviewModal();
  useEffect(() => {
    if (articlePreviewModalVisible) {
      setArticlePreviewModalTitle(title);
      setArticlePreviewModalContentMarkdown(content);
    }
  }, [
    articlePreviewModalVisible,
    content,
    setArticlePreviewModalContentMarkdown,
    setArticlePreviewModalTitle,
    title,
  ]);

  return {
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
  };
}
