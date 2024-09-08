'use client';

import {useHljs, useMdConverter, useTeXRenderer} from '@website/hooks';
import {useEffect} from 'react';

import {MarkdownView} from './View';

interface IProps {
  children: string;
  onRenderFinish?: () => unknown;
}

export function Markdown(props: IProps) {
  const {children, onRenderFinish} = props;
  const {loading: converterLoading, html} = useMdConverter(children);
  const {loading: hljsLoading, highlightedHtml} = useHljs(html ?? '');

  const {renderedHTML} = useTeXRenderer(highlightedHtml ?? '', []);

  useEffect(() => {
    if (!converterLoading && !hljsLoading) {
      if (onRenderFinish) onRenderFinish();
    }
  }, [converterLoading, hljsLoading, onRenderFinish]);

  return <MarkdownView HTMLContent={renderedHTML ?? ''} />;
}
