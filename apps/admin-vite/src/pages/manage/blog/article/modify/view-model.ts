import assert from 'node:assert';

import {Article, NewArticle} from '@website/classes';
import {BlogModels} from '@website/model/admin';
import {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

export function useViewModel() {
  const modifyingArticleId = useSearchParameterId();
  const navigate = useNavigate();

  const {isSubmittingArticleModification, handleArticleModificationSubmit} =
    useSubmitArticleModification(() => {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE], {
        replace: true,
      });
    });

  useLayoutEffect(() => {
    if (modifyingArticleId === null) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE], {
        replace: true,
      });
    }
  }, [modifyingArticleId, navigate]);

  return {
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

export function useSubmitArticleModification(afterSubmitSuccess?: () => void) {
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
          afterSubmitSuccess?.();
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
