import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

export const GridBackgroundColorValue = '#bbada0';

const GridBackgroundColorVariableName = '--grid-background-color';

export const GridBackgroundColor = getCSSVariableValueExpression(
  GridBackgroundColorVariableName,
);

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  GridBackgroundColorVariableName,
  GridBackgroundColorValue,
);
