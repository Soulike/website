import {highlightAll} from '@website/hljs/ssr';
import {converter} from '@website/md-converter';

import {MarkdownView} from '../../csr/Markdown/View';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  let html = converter.makeHtml(children);
  html = await highlightAll(html);

  return <MarkdownView HTMLContent={html} />;
}
