import {script} from '@website/utils';
import {type DependencyList, useCallback, useEffect, useMemo} from 'react';

declare global {
    var MathJax: any;
}

/**
 * @description Load MaxJax to render Math for whole page.
 * Due to the design of Mathjax, the hook need to reload MaxJax when the content of the page changes.
 *
 * @param deps When the items in deps changed, MaxJax will be reloaded.
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
        const $mathjaxScriptTag = document.querySelector(
            `#${MATHJAX_SCRIPT_ID}`,
        );
        if ($mathjaxScriptTag === null) {
            await script.loadExternalScript(MATHJAX_CDN_URL, {
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
        if (!globalThis?.MathJax?.startup?.promise) return; // Waiting for MathJax ready
        await globalThis.MathJax.startup.promise;
        await globalThis.MathJax.typesetPromise();
    }, []);

    loadMathJaxConfig();
    void loadMathJaxScript();

    useEffect(() => {
        void runMathJax();
    }, [deps]);
}
