import {ReactElement, useEffect, useState} from 'react';

import {
  ArticlePreviewModalView,
  type ArticlePreviewModalViewProps,
} from './view.js';

interface Props
  extends Omit<ArticlePreviewModalViewProps, 'loading' | 'children'> {
  contentMarkdown: string;
}

export function ArticlePreviewModal(props: Props) {
  const [loading, setLoading] = useState(true);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const {contentMarkdown, open} = props;

  useEffect(() => {
    setLoading(true);
    if (!open) {
      return;
    }
    // Load `Markdown` when open for better code-splitting.
    void import('@website/react-components/csr').then(({Markdown}) => {
      setModalContent(<Markdown>{contentMarkdown}</Markdown>);
      setLoading(false);
    });
  }, [contentMarkdown, open]);

  return (
    <ArticlePreviewModalView {...props} loading={loading}>
      {modalContent}
    </ArticlePreviewModalView>
  );
}
