import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

/**
 * Background color values for 2048 game tiles
 */
export const TileBackgroundColorValue = Object.freeze({
  TILE_EMPTY: '#cdc1b4',
  TILE_2: '#eee4da',
  TILE_4: '#ede0c8',
  TILE_8: '#f2b179',
  TILE_16: '#f59563',
  TILE_32: '#f67c5f',
  TILE_64: '#f65e3b',
  TILE_128: '#edcf72',
  TILE_256: '#edcc61',
  TILE_512: '#edc850',
  TILE_1024: '#edc53f',
  TILE_2048: '#edc22e',
  TILE_HIGHER_VALUE: '#3c3a32',
});

const TileBackgroundColorVariableName = Object.freeze({
  TILE_EMPTY: '--tile-empty',
  TILE_2: '--tile-2',
  TILE_4: '--tile-4',
  TILE_8: '--tile-8',
  TILE_16: '--tile-16',
  TILE_32: '--tile-32',
  TILE_64: '--tile-64',
  TILE_128: '--tile-128',
  TILE_256: '--tile-256',
  TILE_512: '--tile-512',
  TILE_1024: '--tile-1024',
  TILE_2048: '--tile-2048',
  TILE_HIGHER_VALUE: '--tile-higher-value',
});

/**
 * Background colors for 2048 game tiles
 */
export const TileBackgroundColor = Object.freeze({
  TILE_EMPTY: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_EMPTY,
  ),
  TILE_2: getCSSVariableValueExpression(TileBackgroundColorVariableName.TILE_2),
  TILE_4: getCSSVariableValueExpression(TileBackgroundColorVariableName.TILE_4),
  TILE_8: getCSSVariableValueExpression(TileBackgroundColorVariableName.TILE_8),
  TILE_16: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_16,
  ),
  TILE_32: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_32,
  ),
  TILE_64: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_64,
  ),
  TILE_128: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_128,
  ),
  TILE_256: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_256,
  ),
  TILE_512: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_512,
  ),
  TILE_1024: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_1024,
  ),
  TILE_2048: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_2048,
  ),
  TILE_HIGHER_VALUE: getCSSVariableValueExpression(
    TileBackgroundColorVariableName.TILE_HIGHER_VALUE,
  ),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_EMPTY,
  TileBackgroundColorValue.TILE_EMPTY,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_2,
  TileBackgroundColorValue.TILE_2,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_4,
  TileBackgroundColorValue.TILE_4,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_8,
  TileBackgroundColorValue.TILE_8,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_16,
  TileBackgroundColorValue.TILE_16,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_32,
  TileBackgroundColorValue.TILE_32,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_64,
  TileBackgroundColorValue.TILE_64,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_128,
  TileBackgroundColorValue.TILE_128,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_256,
  TileBackgroundColorValue.TILE_256,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_512,
  TileBackgroundColorValue.TILE_512,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_1024,
  TileBackgroundColorValue.TILE_1024,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_2048,
  TileBackgroundColorValue.TILE_2048,
);
setCSSVariableValue(
  rootElement,
  TileBackgroundColorVariableName.TILE_HIGHER_VALUE,
  TileBackgroundColorValue.TILE_HIGHER_VALUE,
);
