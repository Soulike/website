import type {Article} from '@website/classes';
import {List} from 'antd';
import {useMemo} from 'react';

import {ArticlePreviewCard} from '@/components/ArticleList/components/ArticleListItem/components/ArticlePreviewCard/index.js';
import {useMarkdownAbstract} from '@/hooks/useMarkdownAbstract.js';

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
  const {loading: abstractLoading, abstract} = useMarkdownAbstract(content);
  const {idToCategory, loading: viewModelLoading} = useViewModel();
  const time = new Date(publicationTime);
  const category = idToCategory.get(categoryId.toString());

  const loading = useMemo(
    () => abstractLoading || viewModelLoading,
    [abstractLoading, viewModelLoading],
  );

  return (
    <Item key={id}>
      <ArticlePreviewCard
        loading={loading}
        articleId={id}
        articleTitle={title}
        articleTime={time}
        articleCategory={category}
        articleViewAmount={pageViews}
        articleBriefTextMarkdown={abstract}
      />
    </Item>
  );
}
