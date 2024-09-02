'use client';

import {TexRenderer} from '@website/tex-renderer/csr';
import {type DependencyList, useEffect, useState} from 'react';

/**
 * @description Load MathJax to render Math for whole page.
 * Due to the design of MathJax, the hook need to rerun MathJax when the content of the page changes.
 *
 * @param deps When the items in deps changed, MathJax will rerun.
 * */
export function useMathJax(deps: Readonly<DependencyList>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!document) {
      return;
    }
    setLoading(true);
    TexRenderer.renderAllTex().finally(() => {
      setLoading(false);
    });
  }, [...deps, document]);

  return {loading};
}
