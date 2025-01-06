import {highlightAll} from '@website/hljs/csr';
import {useEffect, useState} from 'react';

export function useHljs(htmlContainingCode: string): {
  loading: boolean;
  highlightedHtml: string;
} {
  const [loading, setLoading] = useState(true);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setHighlightedHtml('');
    void highlightAll(htmlContainingCode).then((html) => {
      setHighlightedHtml(html);
      setLoading(false);
    });
  }, [htmlContainingCode]);

  return {loading, highlightedHtml};
}
