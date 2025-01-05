import {MarkdownArticle} from './components/MarkdownArticle/index.js';

export interface IMarkdownViewProps {
  HTMLContent: string;
}

export function MarkdownView(props: IMarkdownViewProps) {
  const {HTMLContent} = props;

  return <MarkdownArticle dangerouslySetInnerHTML={{__html: HTMLContent}} />;
}
