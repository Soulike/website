import assert from 'node:assert';

import {BlogModels} from '@module/model/admin';
import {type Article, ArticleDraftSchema, ArticleSchema} from '@schema/blog';
import {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';

import {
  ARTICLE_DRAFT_FIELD_LABELS,
  validateFormSchema,
} from '@/helpers/validation-i18n-helper.js';
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
  if (id === null || !/^[1-9]\d*$/.test(id)) {
    return null;
  }
  const parsed = ArticleSchema.shape.id.safeParse(Number(id));
  return parsed.success ? parsed.data : null;
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
      const draft = validateFormSchema(
        ArticleDraftSchema,
        {title, content, category: selectedCategory, isVisible},
        ARTICLE_DRAFT_FIELD_LABELS,
        onValidationFailed,
      );
      if (draft === null) {
        return;
      }

      setIsSubmitting(true);
      articleModel
        .modify(id, draft)
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
