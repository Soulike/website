import {MarkdownArticleRenderer} from '@website/markdown-article-renderer/ssr';

import {MarkdownView} from '../../shared-views/MarkdownView';

interface IProps {
  children: string;
}

export async function Markdown(props: IProps) {
  const {children} = props;
  const html = await MarkdownArticleRenderer.renderToHtml(children);

  return <MarkdownView htmlContent={html} />;
}
