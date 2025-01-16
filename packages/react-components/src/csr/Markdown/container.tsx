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
    const [{highlightAll}, {converter}, {TeXRenderer}] = await Promise.all([
      import('@website/hljs/csr'),
      import('@website/md-converter'),
      import('@website/tex-renderer/csr'),
    ]);

    const rawHtml = converter.makeHtml(children);
    const codeHighlightedHtml = await highlightAll(rawHtml);
    const texRenderedHtml =
      await TeXRenderer.renderAllTexInHTML(codeHighlightedHtml);
    return texRenderedHtml;
  }, [children]);

  useEffect(() => {
    if (onRenderStart) {
      onRenderStart();
    }
    void renderChildrenToHtml().then((textRenderedHtml) => {
      setRenderedHtml(textRenderedHtml);
      if (onRenderFinish) {
        onRenderFinish();
      }
    });
  }, [onRenderFinish, onRenderStart, renderChildrenToHtml]);

  return <MarkdownView htmlContent={renderedHtml} />;
}
