import {convertDOMToString, convertHTMLStringToDOM} from '@website/utils/csr';

import {hljs} from './hljs.js';

export class HtmlCodeHighlighter {
  public static highlightAll(html: string): string {
    const dom = convertHTMLStringToDOM(html);
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
