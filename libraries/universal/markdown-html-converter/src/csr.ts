import {htmlSanitizer} from '@library/html-sanitizer/csr';

import {MarkdownHtmlConverter} from './core/markdown-html-converter.js';
import {IMarkdownHtmlConverter} from './core/types.js';

class CsrMarkdownHtmlConverter implements IMarkdownHtmlConverter {
  private static readonly converter = new MarkdownHtmlConverter(htmlSanitizer);

  public toHtml(markdown: string) {
    return CsrMarkdownHtmlConverter.converter.toHtml(markdown);
  }
}

export const markdownHtmlConverter = new CsrMarkdownHtmlConverter();
