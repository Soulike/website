import {TeXRenderer} from '@website/tex-renderer/csr';
import {type DependencyList, useEffect, useState} from 'react';

export function useTeXRenderer(html: string, deps: Readonly<DependencyList>) {
  const [renderedHtml, setRenderedHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void TeXRenderer.renderAllTexInHTML(html).then((html) => {
      setRenderedHtml(html);
      setLoading(false);
    });
  }, [html, ...deps]);

  return {loading, renderedHtml};
}
