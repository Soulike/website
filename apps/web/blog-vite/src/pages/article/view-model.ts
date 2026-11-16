import {useLazyPromise} from '@library/hooks';
import {articleModel, categoryModel} from '@module/model/blog';
import {type Article, type Category} from '@schema/blog';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';

import {getDiffInDays, parseToDate} from '@/helpers/date-helpers.js';
import {STRING_KEY, useI18nString} from '@/i18n/index.js';
import {
  ArticlePathParams,
  PAGE_ID,
  PAGE_ID_TO_PATH,
} from '@/router/page-config/index.js';

export function useViewModel() {
  const {
    loadArticle,
    loading: articleLoading,
    error: articleLoadError,
    article,
  } = useLoadArticle();
  const {
    loadCategory,
    loading: categoryLoading,
    error: categoryLoadError,
    category,
  } = useLoadCategory();

  const [now] = useState(() => new Date());
  const shouldShowOutdatedMessage = shouldShowOutdatedWarningMessage(
    article,
    now,
  );
  const outdatedWarningMessage = useOutdatedWarningMessage(article, now);

  const loadingString = useI18nString(STRING_KEY.UI_LABEL_LOADING);
  const pageTitle = useI18nString(
    STRING_KEY.PAGE_TITLE_ARTICLE,
    article?.title ?? loadingString,
  );

  const {id} = useParams<keyof ArticlePathParams>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.INDEX]);
      return;
    }
    const articleId = Number.parseInt(id);
    if (Number.isNaN(articleId)) {
      void navigate(PAGE_ID_TO_PATH[PAGE_ID.INDEX]);
      return;
    }
    loadArticle(articleId);
  }, [id, loadArticle, navigate]);

  useEffect(() => {
    if (article) {
      const {category} = article;
      loadCategory(category);
    }
  }, [article, loadCategory]);

  return {
    pageTitle,
    shouldShowOutdatedMessage,
    outdatedWarningMessage,
    article,
    articleLoading,
    articleLoadError,
    category,
    categoryLoading,
    categoryLoadError,
  };
}

function useLoadArticle() {
  const {run, pending, rejectedError, resolvedValue} = useLazyPromise(
    (id: Article['id']) => articleModel.getById(id),
  );

  return {
    loadArticle: run,
    loading: pending,
    error: rejectedError,
    article: resolvedValue,
  };
}

function useLoadCategory() {
  const {run, pending, rejectedError, resolvedValue} = useLazyPromise(
    (id: Category['id']) => categoryModel.getById(id),
  );

  return {
    loadCategory: run,
    loading: pending,
    error: rejectedError,
    category: resolvedValue,
  };
}

function useOutdatedWarningMessage(article: Article | null, now: Date): string {
  return useI18nString(
    STRING_KEY.UI_MESSAGE_ARTICLE_MAYBE_OUTDATED,
    article
      ? getDiffInDays(now, parseToDate(article.publicationTime)).toString()
      : '-1',
  );
}

function shouldShowOutdatedWarningMessage(article: Article | null, now: Date) {
  if (!article) {
    return false;
  }
  const diffInDays = getDiffInDays(now, parseToDate(article.publicationTime));
  return diffInDays > 30;
}
