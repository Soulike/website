import {useEffect, useState} from 'react';

export function useMdConverter(markdown: string): {
  loading: boolean;
  html: string;
} {
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setHtml('');
    void import('@website/md-converter').then(({converter}) => {
      const html = converter.makeHtml(markdown);
      setHtml(html);
      setLoading(false);
    });
  }, [markdown]);

  return {loading, html};
}
