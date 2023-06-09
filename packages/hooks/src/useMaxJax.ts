import {script} from '@website/utils';
import {type DependencyList, useEffect} from 'react';

/**
 * @description Load MaxJax to render Math for whole page.
 * Due to the design of Mathjax, the hook need to reload MaxJax when the content of the page changes.
 *
 * @param deps When the items in deps changed, MaxJax will be reloaded.
 * */
export function useMaxJax(deps?: Readonly<DependencyList>) {
    const typesetId = 'mathjax-typeset';

    useEffect(() => {
        const $typeset = document.querySelector('#' + typesetId);
        if ($typeset !== null) {
            $typeset.remove();
        }
        script.loadScript(`MathJax.typesetPromise()`, {id: typesetId});
    }, [deps]);
}
