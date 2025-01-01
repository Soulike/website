import {useEffect, useState} from 'react';

export function useMdConverter(markdown: string | undefined): {
  loading: boolean;
  html: string | null;
} {
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setHtml(null);
    if (markdown === undefined) {
      return;
    }
    void import('@website/md-converter')
      .then(({converter}) => {
        const html = converter.makeHtml(markdown);
        setHtml(html);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [markdown]);

  return {loading, html};
}
