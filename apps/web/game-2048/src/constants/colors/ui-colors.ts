import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

/**
 * UI color values for the 2048 game interface
 */
export const UIColorValue = Object.freeze({
  BACKGROUND: '#eee4da',
});

const UIColorVariableName = Object.freeze({
  BACKGROUND: '--ui-background-color',
});

/**
 * UI colors for the 2048 game interface
 */
export const UIColor = Object.freeze({
  BACKGROUND: getCSSVariableValueExpression(UIColorVariableName.BACKGROUND),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BACKGROUND,
  UIColorValue.BACKGROUND,
);
