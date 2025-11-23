import assert from 'node:assert';

import {useAntdSwitch} from '@library/hooks';
import {Article, Category} from '@module/classes';
import {BlogModels} from '@module/model/admin';
import {BlogModelHooks} from '@module/model/react/admin';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';

import {useArticlePreviewModal} from '@/components/ArticlePreviewModal/index.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

export function useViewModel(articleId: Article['id']) {
  const navigate = useNavigate();
  const {
    article,
    loading: articleLoading,
    error: articleLoadError,
  } = BlogModelHooks.ArticleModelHooks.useArticleById(articleId);
  const {
    category,
    loading: categoryLoading,
    error: categoryLoadError,
  } = useCategoryById(article?.category ?? null);

  const {
    checked: isVisibleChecked,
    onChange: onIsVisibleSwitchChange,
    setChecked: setIsVisibleSwitchChecked,
  } = useAntdSwitch();

  useEffect(() => {
    if (articleLoading || articleLoadError || !article) {
      return;
    }
    setIsVisibleSwitchChecked(article.isVisible);
  }, [article, articleLoadError, articleLoading, setIsVisibleSwitchChecked]);

  const handleModifyArticleButtonClick = useCallback(() => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('id', articleId.toString());
    void navigate(
      `${
        PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]
      }?${urlSearchParams.toString()}`,
    );
  }, [articleId, navigate]);

  const {deleting: articleDeleting, deleteArticle} = useArticleDeletion();

  const {
    show: showArticlePreviewModal,
    setTitle: setArticlePreviewModalTitle,
    setContentMarkdown: setArticlePreviewModalContentMarkdown,
    modal: articlePreviewModal,
  } = useArticlePreviewModal();

  const handleTitleClick = useMemo(
    () => () => {
      if (!article) {
        return;
      }
      setArticlePreviewModalTitle(article.title);
      setArticlePreviewModalContentMarkdown(article.content);
      showArticlePreviewModal();
    },
    [
      article,
      setArticlePreviewModalContentMarkdown,
      setArticlePreviewModalTitle,
      showArticlePreviewModal,
    ],
  );

  return {
    article,
    articleLoading,
    articleLoadError,
    category,
    categoryLoading,
    categoryLoadError,
    isVisibleChecked,
    onIsVisibleSwitchChange,
    handleTitleClick,
    handleModifyArticleButtonClick,
    articleDeleting,
    deleteArticle,
    showArticlePreviewModal,
    articlePreviewModal,
  };
}

function useCategoryById(categoryId: Category['id'] | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);

  useEffect(() => {
    if (!categoryId) {
      setCategory(null);
      return;
    }

    setLoading(true);
    categoryModel
      .getById(categoryId)
      .then((category) => {
        setCategory(category);
      })
      .catch((error: unknown) => {
        assert(error instanceof Error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId, categoryModel]);

  return {
    category,
    loading,
    error,
  };
}

function useArticleDeletion() {
  const articleModel = useMemo(() => new BlogModels.ArticleModel(), []);
  const [deleting, setDeleting] = useState(false);

  const deleteArticle = useCallback(
    (
      articleId: Article['id'],
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      setDeleting(true);
      articleModel
        .deleteById(articleId)
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch((error: unknown) => {
          assert(error instanceof Error);
          if (onError) {
            onError(error);
          }
        })
        .finally(() => {
          setDeleting(false);
        });
    },
    [articleModel],
  );

  return {
    deleting,
    deleteArticle,
  };
}
