import {HtmlCodeHighlighter} from '@website/html-code-highlighter/ssr';
import {converter} from '@website/md-converter';
import {TeXRenderer} from '@website/tex-renderer/ssr';

import {MarkdownView} from '../../shared-views/MarkdownView';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  let html = converter.makeHtml(children);
  html = await HtmlCodeHighlighter.highlightAll(html);
  html = await TeXRenderer.renderAllTexInHTML(html);

  return <MarkdownView htmlContent={html} />;
}
