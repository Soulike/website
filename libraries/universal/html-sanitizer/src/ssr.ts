import DOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export class HtmlSanitizer {
  public static sanitize(...args: Parameters<(typeof DOMPurify)['sanitize']>) {
    return purify.sanitize(...args);
  }
}
