import type {Article} from '@website/classes';
import {List} from 'antd';
import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';
import {getMarkdownAbstract} from '@/helpers/get-markdown-abstract.js';

import {ArticlePreviewCard} from './components/ArticlePreviewCard/index.js';
import {useViewModel} from './view-model.js';

export interface ArticleListItemProps {
  article: Article;
}

const {Item} = List;

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
  const time = new Date(publicationTime);

  useEffect(() => {
    if (categoryLoadError) {
      showErrorNotification(categoryLoadError);
    }
  }, [categoryLoadError]);

  return (
    <Item key={id}>
      <ArticlePreviewCard
        loading={categoryLoading}
        articleId={id}
        articleTitle={title}
        articleTime={time}
        articleCategory={category ?? undefined}
        articleViewAmount={pageViews}
        articleBriefTextMarkdown={abstract}
      />
    </Item>
  );
}
