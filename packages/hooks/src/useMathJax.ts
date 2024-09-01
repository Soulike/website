'use client';

import {loadExternalScript} from '@website/utils/csr';
import {type DependencyList, useCallback, useEffect, useMemo} from 'react';

declare global {
  // eslint-disable-next-line no-var
  var MathJax: any;
}

/**
 * @description Load MathJax to render Math for whole page.
 * Due to the design of MathJax, the hook need to rerun MathJax when the content of the page changes.
 *
 * @param deps When the items in deps changed, MathJax will rerun.
 * */
export function useMathJax(deps?: Readonly<DependencyList>) {
  const MATHJAX_CDN_URL = 'https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js';
  const MATHJAX_SCRIPT_ID = 'mathjax-cdn';
  const MATHJAX_CONFIG = useMemo(
    () =>
      Object.freeze({
        tex: {
          inlineMath: [['$', '$']],
          displayMath: [['$$', '$$']],
          processEnvironments: true,
        },
      }),
    [],
  );

  const loadMathJaxScript = useCallback(async () => {
    if (!document) {
      return;
    }
    const $mathjaxScriptTag = document.querySelector(`#${MATHJAX_SCRIPT_ID}`);
    if ($mathjaxScriptTag === null) {
      await loadExternalScript(MATHJAX_CDN_URL, {
        id: MATHJAX_SCRIPT_ID,
      });
    }
  }, []);

  const loadMathJaxConfig = useCallback(() => {
    if (!globalThis.MathJax) {
      globalThis.MathJax = {...MATHJAX_CONFIG};
    }
  }, []);

  const runMathJax = useCallback(async () => {
    if (!globalThis?.MathJax?.startup?.promise) {
      return;
    } // Waiting for MathJax ready
    await globalThis.MathJax.startup.promise;
    await globalThis.MathJax.typesetPromise();
  }, []);

  useEffect(() => {
    loadMathJaxConfig();
    void loadMathJaxScript();
    void runMathJax();
  }, [deps, globalThis.window?.document]);
}
