import {htmlSanitizer} from '@library/html-sanitizer/ssr';

import {MarkdownHtmlConverter} from './core/markdown-html-converter.js';
import {IMarkdownHtmlConverter} from './core/types.js';

export class SsrMarkdownHtmlConverter implements IMarkdownHtmlConverter {
  private static readonly converter = new MarkdownHtmlConverter(htmlSanitizer);

  public toHtml(markdown: string) {
    return SsrMarkdownHtmlConverter.converter.toHtml(markdown);
  }
}

export const markdownHtmlConverter = new SsrMarkdownHtmlConverter();
