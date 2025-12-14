import {HtmlCodeHighlighter} from '@library/html-code-highlighter/ssr';
import {markdownHtmlConverter} from '@library/markdown-html-converter/ssr';
import {TeXRenderer} from '@library/tex-renderer';

export class MarkdownArticleRenderer {
  public static async renderToHtml(markdown: string): Promise<string> {
    let html = markdownHtmlConverter.toHtml(markdown);
    html = await HtmlCodeHighlighter.highlightAll(html);
    html = TeXRenderer.renderAllTexInHTML(html);
    return html;
  }
}
