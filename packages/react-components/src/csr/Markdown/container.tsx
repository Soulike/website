import DOMPurify from 'dompurify';
import {useCallback, useEffect, useState} from 'react';

import {MarkdownView} from '../../shared-views/MarkdownView';

interface IProps {
  children: string;
  onRenderStart?: () => unknown;
  onRenderFinish?: () => unknown;
}

export function Markdown(props: IProps) {
  const {children, onRenderStart, onRenderFinish} = props;
  const [renderedHtml, setRenderedHtml] = useState('');

  const renderChildrenToHtml = useCallback(async () => {
    const {MarkdownArticleRenderer} = await import(
      '@website/markdown-article-renderer/csr'
    );
    return MarkdownArticleRenderer.renderToHtml(children);
  }, [children]);

  useEffect(() => {
    if (onRenderStart) {
      onRenderStart();
    }
    void renderChildrenToHtml().then((textRenderedHtml) => {
      setRenderedHtml(DOMPurify.sanitize(textRenderedHtml));
      if (onRenderFinish) {
        onRenderFinish();
      }
    });
  }, [onRenderFinish, onRenderStart, renderChildrenToHtml]);

  return <MarkdownView htmlContent={renderedHtml} />;
}
