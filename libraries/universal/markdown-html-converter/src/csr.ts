import {htmlSanitizer} from '@library/html-sanitizer/csr';

import {MarkdownHtmlConverter} from './core/markdown-html-converter.js';

export const markdownHtmlConverter = new MarkdownHtmlConverter(htmlSanitizer);
