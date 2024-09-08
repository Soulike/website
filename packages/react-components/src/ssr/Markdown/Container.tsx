import {highlightAll} from '@website/hljs/ssr';
import {converter} from '@website/md-converter';
import {TeXRenderer} from '@website/tex-renderer/ssr';

import {MarkdownView} from '../../csr/Markdown/View';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  let html = converter.makeHtml(children);
  html = await highlightAll(html);
  html = TeXRenderer.renderAllTexInHTML(html);

  return <MarkdownView HTMLContent={html} />;
}
