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
    import('@website/md-converter')
      .then(({default: markdownConverter}) => {
        const html = markdownConverter.makeHtml(markdown);
        setHtml(html);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [markdown]);

  return {loading, html};
}
