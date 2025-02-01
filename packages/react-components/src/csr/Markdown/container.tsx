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
    const [{HtmlCodeHighlighter}, {MarkdownHtmlConverter}, {TeXRenderer}] =
      await Promise.all([
        import('@website/html-code-highlighter/csr'),
        import('@website/markdown-html-converter'),
        import('@website/tex-renderer'),
      ]);

    const rawHtml = MarkdownHtmlConverter.toHtml(children);
    const codeHighlightedHtml = await HtmlCodeHighlighter.highlightAll(rawHtml);
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
