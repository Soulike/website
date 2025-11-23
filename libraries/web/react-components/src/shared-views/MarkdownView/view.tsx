import '@library/markdown-article-renderer/style.css';

import {MarkdownArticle} from './components/MarkdownArticle/index.js';

export interface IMarkdownViewProps {
  htmlContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {htmlContent} = props;

  return <MarkdownArticle dangerouslySetInnerHTML={{__html: htmlContent}} />;
}
