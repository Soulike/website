import type DOMPurify from 'dompurify';

export interface HtmlSanitizer {
  sanitize(
    ...args: Parameters<(typeof DOMPurify)['sanitize']>
  ): ReturnType<(typeof DOMPurify)['sanitize']>;
}
