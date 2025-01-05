import {TeXRenderer} from '@website/tex-renderer/csr';
import {type DependencyList, useEffect, useState} from 'react';

export function useTeXRenderer(html: string, deps: Readonly<DependencyList>) {
  const [renderedHTML, setRenderedHTML] = useState('');

  useEffect(() => {
    if (!html) {
      return;
    }
    const renderedHTML = TeXRenderer.renderAllTexInHTML(html);
    setRenderedHTML(renderedHTML);
  }, [html, ...deps]);

  return {renderedHTML};
}
