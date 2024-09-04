'use client';

import {type Category} from '@website/classes';
import {useMdConverter} from '@website/hooks';

import {ArticlePreviewCardView} from './View';

export interface IArticlePreviewCardProps {
  articleId: number;
  articleTitle: string;
  articleTime: Readonly<Date>;
  articleCategory: Readonly<Category> | undefined;
  articleViewAmount: number;
  articleBriefTextMarkdown: string;
}

export function ArticlePreviewCard(props: IArticlePreviewCardProps) {
  const {articleBriefTextMarkdown, ...restProps} = props;

  const {loading: mdConverterLoading, html: articleBriefTextHtml} =
    useMdConverter(articleBriefTextMarkdown);

  return (
    <ArticlePreviewCardView
      loading={mdConverterLoading}
      articleBriefTextHtml={articleBriefTextHtml ?? ''}
      {...restProps}
    />
  );
}
