import '@website/html-code-highlighter/style.css';
import '@website/tex-renderer/style.css';

import {MarkdownArticle} from './components/MarkdownArticle';

export interface IMarkdownViewProps {
  htmlContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {htmlContent} = props;

  return <MarkdownArticle dangerouslySetInnerHTML={{__html: htmlContent}} />;
}
