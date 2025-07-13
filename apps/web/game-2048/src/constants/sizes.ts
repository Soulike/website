import {getCSSVariableValueOnRootElement} from '@/helpers/css-helpers.js';

export const TileFontSizes = Object.freeze({
  NORMAL: getCSSVariableValueOnRootElement('--tile-normal-font-size'),
  SMALL: getCSSVariableValueOnRootElement('--tile-small-font-size'),
  SMALLER: getCSSVariableValueOnRootElement('--tile-smaller-font-size'),
});
