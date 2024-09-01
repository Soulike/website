import {highlightAll} from '@website/hljs/csr';
import {useEffect, useState} from 'react';

export function useHljs(htmlContainingCode: string | undefined): {
  loading: boolean;
  highlightedHtml: string | null;
} {
  const [loading, setLoading] = useState(true);
  const [highlightedHtml, setHighlightedHtmlHtml] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    setHighlightedHtmlHtml(null);
    if (typeof htmlContainingCode !== 'string') {
      return;
    }

    highlightAll(htmlContainingCode)
      .then((html) => {
        setHighlightedHtmlHtml(html);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [htmlContainingCode]);

  return {loading, highlightedHtml};
}
