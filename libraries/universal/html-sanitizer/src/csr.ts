import DOMPurify from 'dompurify';

const purify = DOMPurify(window);

export class HtmlSanitizer {
  public static sanitize(...args: Parameters<(typeof DOMPurify)['sanitize']>) {
    return purify.sanitize(...args);
  }
}
