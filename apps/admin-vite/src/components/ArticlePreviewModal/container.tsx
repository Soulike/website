import {useCallback, useState} from 'react';

import {
  ArticlePreviewModalView,
  type ArticlePreviewModalViewProps,
} from './view.js';

type Props = Omit<
  ArticlePreviewModalViewProps,
  'loading' | 'onMarkdownRenderStart' | 'onMarkdownRenderFinish'
>;

export function ArticlePreviewModal(props: Props) {
  const [isMarkdownRendering, setIsMarkdownRendering] = useState(true);

  const onMarkdownRenderStart = useCallback(() => {
    setIsMarkdownRendering(true);
  }, []);

  const onMarkdownRenderFinish = useCallback(() => {
    setIsMarkdownRendering(false);
  }, []);

  return (
    <ArticlePreviewModalView
      {...props}
      loading={isMarkdownRendering}
      onMarkdownRenderStart={onMarkdownRenderStart}
      onMarkdownRenderFinish={onMarkdownRenderFinish}
    />
  );
}
