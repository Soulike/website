import {htmlSanitizer} from '@library/html-sanitizer/ssr';

import {MarkdownHtmlConverter} from './core/markdown-html-converter.js';

export const markdownHtmlConverter = new MarkdownHtmlConverter(htmlSanitizer);
