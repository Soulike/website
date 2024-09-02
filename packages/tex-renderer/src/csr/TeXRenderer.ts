import {loadExternalScript} from '@website/utils/csr';

import {MATHJAX_CDN_URL, MATHJAX_CONFIG, MATHJAX_SCRIPT_ID} from '../constants';

export class TexRenderer {
  public static async renderAllTex() {
    if (TexRenderer.isMathJaxScriptLoaded()) {
      if (!TexRenderer.isMathJaxReady()) {
        // TeX will be rendered after MathJax is ready
        return;
      }
      await TexRenderer.runMathJax();
    } else {
      TexRenderer.setupMathJaxConfig();
      await TexRenderer.loadMathJaxScript();
    }
  }

  private static setupMathJaxConfig() {
    if (!globalThis.MathJax) {
      globalThis.MathJax = {
        ...MATHJAX_CONFIG,
        startup: {
          ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => {
              return TexRenderer.runMathJax();
            });
          },
        },
      };
    }
  }

  private static async loadMathJaxScript() {
    if (!TexRenderer.isMathJaxScriptLoaded()) {
      await loadExternalScript(MATHJAX_CDN_URL, {
        id: MATHJAX_SCRIPT_ID,
      });
    }
  }

  private static async runMathJax() {
    return globalThis.MathJax.typesetPromise();
  }

  private static isMathJaxScriptLoaded() {
    const $mathjaxScriptTag = document.querySelector(`#${MATHJAX_SCRIPT_ID}`);
    return $mathjaxScriptTag !== null;
  }

  private static isMathJaxReady() {
    return !!globalThis.MathJax.typesetPromise;
  }
}
