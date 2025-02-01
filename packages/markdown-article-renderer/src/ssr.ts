import {HtmlCodeHighlighter} from '@website/html-code-highlighter/ssr';
import {MarkdownHtmlConverter} from '@website/markdown-html-converter';
import {TeXRenderer} from '@website/tex-renderer';

export class MarkdownArticleRenderer {
  public static async renderToHtml(markdown: string): Promise<string> {
    let html = MarkdownHtmlConverter.toHtml(markdown);
    html = await HtmlCodeHighlighter.highlightAll(html);
    html = TeXRenderer.renderAllTexInHTML(html);
    return html;
  }
}
