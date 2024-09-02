'use client';

import {useMathJax} from '@website/hooks';
import {useRef} from 'react';

export interface IMarkdownViewProps {
  HTMLContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {HTMLContent} = props;
  const ref = useRef(null);

  useMathJax([ref.current]);

  return (
    <article
      ref={ref}
      className={'Markdown'}
      dangerouslySetInnerHTML={{__html: HTMLContent}}
    />
  );
}
