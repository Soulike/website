import {getCSSVariableValueOnRootElement} from '@/helpers/css-helpers.js';

export const GridBackgroundColor = getCSSVariableValueOnRootElement(
  '--grid-background-color',
);

/**
 * Background colors for 2048 game tiles
 */
export const TileBackgroundColor = Object.freeze({
  TILE_EMPTY: getCSSVariableValueOnRootElement('--tile-empty'),
  TILE_2: getCSSVariableValueOnRootElement('--tile-2'),
  TILE_4: getCSSVariableValueOnRootElement('--tile-4'),
  TILE_8: getCSSVariableValueOnRootElement('--tile-8'),
  TILE_16: getCSSVariableValueOnRootElement('--tile-16'),
  TILE_32: getCSSVariableValueOnRootElement('--tile-32'),
  TILE_64: getCSSVariableValueOnRootElement('--tile-64'),
  TILE_128: getCSSVariableValueOnRootElement('--tile-128'),
  TILE_256: getCSSVariableValueOnRootElement('--tile-256'),
  TILE_512: getCSSVariableValueOnRootElement('--tile-512'),
  TILE_1024: getCSSVariableValueOnRootElement('--tile-1024'),
  TILE_2048: getCSSVariableValueOnRootElement('--tile-2048'),
  TILE_HIGHER_VALUE: getCSSVariableValueOnRootElement('--tile-higher-value'),
});

/**
 * Text colors for 2048 game tiles
 */
export const TileTextColor = Object.freeze({
  TRANSPARENT: getCSSVariableValueOnRootElement('--tile-text-transparent'),
  DARK: getCSSVariableValueOnRootElement('--tile-text-dark'),
  LIGHT: getCSSVariableValueOnRootElement('--tile-text-light'),
});
