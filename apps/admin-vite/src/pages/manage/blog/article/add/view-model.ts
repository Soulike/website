import assert from 'node:assert';

import {Article, NewArticle} from '@website/classes';
import {BlogModels} from '@website/model/admin';
import {useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';

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
