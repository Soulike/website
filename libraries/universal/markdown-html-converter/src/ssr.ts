import './types.d.js';

import {HtmlSanitizer} from '@library/html-sanitizer/ssr';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';

export class MarkdownHtmlConverter {
  private static readonly converter = new MarkdownIt({
    html: true,
    linkify: false,
    typographer: false,
  })
    .use(footnote)
    .use(taskLists);

  static {
    // Disable link validation since it blocks inline data: images.
    MarkdownHtmlConverter.converter.validateLink = () => true;
  }

  public static toHtml(markdown: string) {
    const html = this.converter.render(markdown);
    return HtmlSanitizer.sanitize(html);
  }
}
