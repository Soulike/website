import {yieldMainThread} from '@website/utils';
import {useCallback, useEffect, useState} from 'react';

export function useHljs(htmlContainingCode: string | undefined): {
  loading: boolean;
  highlightedHtml: string | null;
} {
  const [loading, setLoading] = useState(true);
  const [highlightedHtml, setHighlightedHtmlHtml] = useState<string | null>(
    null,
  );

  const doHighlight = useCallback(async () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlContainingCode ?? '';

    const {default: hljs} = await import('@website/hljs');
    const preBlocks = Array.from(wrapper.querySelectorAll('pre'));
    await Promise.all(
      preBlocks.map(async (pre) => {
        const codeBlocks = pre.querySelectorAll('code');
        codeBlocks.forEach((block) => {
          hljs.highlightElement(block);
        });
        await yieldMainThread();
      }),
    );
    return wrapper.innerHTML;
  }, [htmlContainingCode]);

  useEffect(() => {
    setLoading(true);
    setHighlightedHtmlHtml(null);
    if (typeof htmlContainingCode !== 'string') {
      return;
    }

    doHighlight()
      .then((html) => {
        setHighlightedHtmlHtml(html);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [doHighlight, htmlContainingCode]);

  return {loading, highlightedHtml};
}
