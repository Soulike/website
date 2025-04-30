import {
  convertDOMToString,
  convertHTMLStringToDOM,
} from '@website/dom-helpers/ssr';

import {hljs} from './hljs.js';

export class HtmlCodeHighlighter {
  public static async highlightAll(html: string): Promise<string> {
    const dom = await convertHTMLStringToDOM(html);

    const preBlocks = Array.from(dom.querySelectorAll('pre'));
    preBlocks.forEach((pre) => {
      const codeBlocks = pre.querySelectorAll('code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    });
    return convertDOMToString(dom);
  }
}
