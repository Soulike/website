import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

export const TileFontSizeInPixel = Object.freeze({
  NORMAL: 48,
  SMALL: 40,
  SMALLER: 32,
});

const TileFontSizeVariableName = Object.freeze({
  NORMAL: '--tile-normal-font-size',
  SMALL: '--tile-small-font-size',
  SMALLER: '--tile-smaller-font-size',
});

export const TileGapInPixel = Object.freeze({
  VERTICAL: 10,
  HORIZONTAL: 10,
});

const TileGapVariableName = Object.freeze({
  VERTICAL: '--tile-vertical-gap',
  HORIZONTAL: '--tile-horizontal-gap',
});

export const TileFontSize = Object.freeze({
  NORMAL: getCSSVariableValueExpression(TileFontSizeVariableName.NORMAL),
  SMALL: getCSSVariableValueExpression(TileFontSizeVariableName.SMALL),
  SMALLER: getCSSVariableValueExpression(TileFontSizeVariableName.SMALLER),
});

export const TileGap = Object.freeze({
  VERTICAL: getCSSVariableValueExpression(TileGapVariableName.VERTICAL),
  HORIZONTAL: getCSSVariableValueExpression(TileGapVariableName.HORIZONTAL),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  TileFontSizeVariableName.NORMAL,
  `${TileFontSizeInPixel.NORMAL.toString()}px`,
);
setCSSVariableValue(
  rootElement,
  TileFontSizeVariableName.SMALL,
  `${TileFontSizeInPixel.SMALL.toString()}px`,
);
setCSSVariableValue(
  rootElement,
  TileFontSizeVariableName.SMALLER,
  `${TileFontSizeInPixel.SMALLER.toString()}px`,
);
setCSSVariableValue(
  rootElement,
  TileGapVariableName.VERTICAL,
  `${TileGapInPixel.VERTICAL.toString()}px`,
);
setCSSVariableValue(
  rootElement,
  TileGapVariableName.HORIZONTAL,
  `${TileGapInPixel.HORIZONTAL.toString()}px`,
);
