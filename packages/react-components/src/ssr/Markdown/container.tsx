import {HtmlCodeHighlighter} from '@website/html-code-highlighter/ssr';
import {MarkdownHtmlConverter} from '@website/markdown-html-converter';
import {TeXRenderer} from '@website/tex-renderer';

import {MarkdownView} from '../../shared-views/MarkdownView';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  let html = MarkdownHtmlConverter.toHtml(children);
  html = await HtmlCodeHighlighter.highlightAll(html);
  html = await TeXRenderer.renderAllTexInHTML(html);

  return <MarkdownView htmlContent={html} />;
}
