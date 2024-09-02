'use client';

import {useMathJax} from '@website/hooks';

export interface IMarkdownViewProps {
  HTMLContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {HTMLContent} = props;

  useMathJax([HTMLContent]);

  return (
    <article
      className={'Markdown'}
      dangerouslySetInnerHTML={{__html: HTMLContent}}
    />
  );
}
