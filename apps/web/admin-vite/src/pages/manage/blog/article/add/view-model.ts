import assert from 'node:assert';

import {BlogModels} from '@module/model/admin';
import {type Article, ArticleDraftSchema} from '@schema/blog';
import {useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';

import {
  ARTICLE_DRAFT_FIELD_LABELS,
  getValidationErrorMessage,
} from '@/helpers/validation-i18n-helper.js';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config/index.js';

export function useViewModel() {
  const navigate = useNavigate();
  const afterArticleSubmitSuccess = useCallback(() => {
    void navigate(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]);
  }, [navigate]);
  const {isSubmittingArticle, handleArticleSubmit} = useSubmitArticle(
    afterArticleSubmitSuccess,
  );

  return {
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
      const parsedDraft = ArticleDraftSchema.safeParse({
        title,
        content,
        category: selectedCategory,
        isVisible,
      });
      if (!parsedDraft.success) {
        getValidationErrorMessage(
          parsedDraft.error.issues[0],
          ARTICLE_DRAFT_FIELD_LABELS,
        )
          .then((message) => {
            onValidationFailed(message);
          })
          .catch((e: unknown) => {
            console.error(e);
          });
        return;
      }

      setIsSubmittingArticle(true);
      articleModel
        .add(parsedDraft.data)
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
