import DOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

import type {HtmlSanitizer} from './types.js';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

class SsrHtmlSanitizer implements HtmlSanitizer {
  public sanitize(...args: Parameters<(typeof DOMPurify)['sanitize']>) {
    return purify.sanitize(...args);
  }
}

export const htmlSanitizer = new SsrHtmlSanitizer();
