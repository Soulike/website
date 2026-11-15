import {type Article} from '@schema/blog';
import {useEffect, useMemo} from 'react';

import {parseToDate} from '@/helpers/date-helpers.js';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {getMarkdownAbstract} from '@/helpers/markdown-helpers.js';

import {ArticlePreviewCard} from './components/ArticlePreviewCard/index.js';
import {useViewModel} from './view-model.js';

export interface ArticleListItemProps {
  article: Article;
}

export function ArticleListItem(props: ArticleListItemProps) {
  const {article} = props;
  const {
    id,
    title,
    content,
    category: categoryId,
    publicationTime,
    pageViews,
  } = article;
  const abstract = getMarkdownAbstract(content);
  const {category, categoryLoading, categoryLoadError} =
    useViewModel(categoryId);
  const time = useMemo(() => parseToDate(publicationTime), [publicationTime]);

  useEffect(() => {
    if (categoryLoadError) {
      showErrorNotification(categoryLoadError);
    }
  }, [categoryLoadError]);

  return (
    <ArticlePreviewCard
      loading={categoryLoading}
      articleId={id}
      articleTitle={title}
      articleTime={time}
      articleCategory={category ?? undefined}
      articleViewAmount={pageViews}
      articleBriefTextMarkdown={abstract}
    />
  );
}
