import {convertDOMToString, convertHTMLStringToDOM} from '@website/utils/ssr';

import {hljs} from '../hljs';

export async function highlightAll(html: string): Promise<string> {
  const dom = await convertHTMLStringToDOM(html);

  const preBlocks = Array.from(dom.querySelectorAll('pre'));
  await Promise.all(
    preBlocks.map(async (pre) => {
      const codeBlocks = pre.querySelectorAll('code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }),
  );
  return convertDOMToString(dom);
}
