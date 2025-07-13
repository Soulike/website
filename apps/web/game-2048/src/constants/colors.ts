import {getCSSVariableOnRootElement} from '@/helpers/css-helpers.js';

export const GridBackgroundColor = getCSSVariableOnRootElement(
  '--grid-background-color',
);

/**
 * Background colors for 2048 game tiles
 */
export const TileBackgroundColor = Object.freeze({
  TILE_EMPTY: getCSSVariableOnRootElement('--tile-empty'),
  TILE_2: getCSSVariableOnRootElement('--tile-2'),
  TILE_4: getCSSVariableOnRootElement('--tile-4'),
  TILE_8: getCSSVariableOnRootElement('--tile-8'),
  TILE_16: getCSSVariableOnRootElement('--tile-16'),
  TILE_32: getCSSVariableOnRootElement('--tile-32'),
  TILE_64: getCSSVariableOnRootElement('--tile-64'),
  TILE_128: getCSSVariableOnRootElement('--tile-128'),
  TILE_256: getCSSVariableOnRootElement('--tile-256'),
  TILE_512: getCSSVariableOnRootElement('--tile-512'),
  TILE_1024: getCSSVariableOnRootElement('--tile-1024'),
  TILE_2048: getCSSVariableOnRootElement('--tile-2048'),
  TILE_HIGHER_VALUE: getCSSVariableOnRootElement('--tile-higher-value'),
});

/**
 * Text colors for 2048 game tiles
 */
export const TileTextColor = Object.freeze({
  TRANSPARENT: getCSSVariableOnRootElement('--tile-text-transparent'),
  DARK: getCSSVariableOnRootElement('--tile-text-dark'),
  LIGHT: getCSSVariableOnRootElement('--tile-text-light'),
});
