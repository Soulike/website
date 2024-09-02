export const MATHJAX_CDN_URL =
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
export const MATHJAX_CONFIG = Object.freeze({
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
    processEnvironments: true,
  },
});
export const MATHJAX_SCRIPT_ID = 'mathjax-cdn';
