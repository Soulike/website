// import {MathJaxConverter} from '@website/mathjax-converter';
import {highlightAll} from '@website/hljs/ssr';
import {converter} from '@website/md-converter';

import {MarkdownView} from '../../csr/Markdown/View';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  const markdownHtml = converter.makeHtml(children);
  const highlightedHtml = await highlightAll(markdownHtml);

  return <MarkdownView HTMLContent={highlightedHtml} />;
}
