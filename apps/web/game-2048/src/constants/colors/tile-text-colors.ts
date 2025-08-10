import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

/**
 * Text color values for 2048 game tiles
 */
export const TileTextColorValue = Object.freeze({
  TRANSPARENT: 'transparent',
  DARK: '#776e65',
  LIGHT: '#f9f6f2',
});

const TileTextColorVariableName = Object.freeze({
  TRANSPARENT: '--tile-text-transparent',
  DARK: '--tile-text-dark',
  LIGHT: '--tile-text-light',
});

/**
 * Text colors for 2048 game tiles
 */
export const TileTextColor = Object.freeze({
  TRANSPARENT: getCSSVariableValueExpression(
    TileTextColorVariableName.TRANSPARENT,
  ),
  DARK: getCSSVariableValueExpression(TileTextColorVariableName.DARK),
  LIGHT: getCSSVariableValueExpression(TileTextColorVariableName.LIGHT),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  TileTextColorVariableName.TRANSPARENT,
  TileTextColorValue.TRANSPARENT,
);
setCSSVariableValue(
  rootElement,
  TileTextColorVariableName.DARK,
  TileTextColorValue.DARK,
);
setCSSVariableValue(
  rootElement,
  TileTextColorVariableName.LIGHT,
  TileTextColorValue.LIGHT,
);
