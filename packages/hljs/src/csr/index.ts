import {
  convertDOMToString,
  convertHTMLStringToDOM,
  yieldMainThread,
} from '@website/utils/csr';

export async function highlightAll(html: string): Promise<string> {
  const {hljs} = await import('../hljs.js');

  const dom = convertHTMLStringToDOM(html);

  const preBlocks = Array.from(dom.querySelectorAll('pre'));
  await Promise.all(
    preBlocks.map(async (pre) => {
      const codeBlocks = pre.querySelectorAll('code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
      await yieldMainThread();
    }),
  );
  return convertDOMToString(dom);
}
