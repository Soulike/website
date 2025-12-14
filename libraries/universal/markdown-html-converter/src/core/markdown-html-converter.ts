import './fixup.d.js';

import {HtmlSanitizer} from '@library/html-sanitizer/types';
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
    this.converter.validateLink = () => true;
  }

  private readonly sanitizer: HtmlSanitizer;

  constructor(sanitizer: HtmlSanitizer) {
    this.sanitizer = sanitizer;
  }

  public toHtml(markdown: string) {
    const html = MarkdownHtmlConverter.converter.render(markdown);
    return this.sanitizer.sanitize(html);
  }
}
