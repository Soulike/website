import {useCallback, useEffect, useState} from 'react';

import {
  ArticlePreviewModalView,
  type ArticlePreviewModalViewProps,
} from './view.js';

type Props = Omit<
  ArticlePreviewModalViewProps,
  'loading' | 'onMarkdownRenderFinish'
>;

export function ArticlePreviewModal(props: Props) {
  const [isMarkdownRendering, setIsMarkdownRendering] = useState(true);
  const {contentMarkdown} = props;

  useEffect(() => {
    setIsMarkdownRendering(true);
  }, [contentMarkdown]);

  const onMarkdownRenderFinish = useCallback(() => {
    setIsMarkdownRendering(false);
  }, []);

  return (
    <ArticlePreviewModalView
      {...props}
      loading={isMarkdownRendering}
      onMarkdownRenderFinish={onMarkdownRenderFinish}
    />
  );
}
