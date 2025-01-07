import {useHljs, useMdConverter, useTeXRenderer} from '@website/hooks';
import {useEffect} from 'react';

import {MarkdownView} from '../../shared-views/MarkdownView';

interface IProps {
  children: string;
  onRenderFinish?: () => unknown;
}

export function Markdown(props: IProps) {
  const {children, onRenderFinish} = props;
  const {loading: converterLoading, html} = useMdConverter(children);
  const {loading: hljsLoading, highlightedHtml} = useHljs(html);
  const {loading: texRendererLoading, renderedHtml} = useTeXRenderer(
    highlightedHtml,
    [],
  );

  useEffect(() => {
    if (!converterLoading && !hljsLoading && !texRendererLoading) {
      if (onRenderFinish) onRenderFinish();
    }
  }, [converterLoading, hljsLoading, texRendererLoading, onRenderFinish]);

  return <MarkdownView htmlContent={renderedHtml} />;
}
