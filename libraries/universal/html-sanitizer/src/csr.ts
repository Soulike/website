import DOMPurify from 'dompurify';

import type {HtmlSanitizer} from './types.js';

const purify = DOMPurify(window);

class CsrHtmlSanitizer implements HtmlSanitizer {
  public sanitize(...args: Parameters<(typeof DOMPurify)['sanitize']>) {
    return purify.sanitize(...args);
  }
}

export const htmlSanitizer = new CsrHtmlSanitizer();
