import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

/**
 * UI color values for the 2048 game interface
 */
export const UIColorValue = Object.freeze({
  BACKGROUND: '#eee4da',
  // Modal colors
  MODAL_BACKGROUND: '#faf8ef',
  MODAL_BORDER: '#bbada0',
  MODAL_TEXT_PRIMARY: '#776e65',
  MODAL_TEXT_SECONDARY: '#8f7a66',
  MODAL_BUTTON_PRIMARY: '#8f7a66',
  MODAL_BUTTON_PRIMARY_HOVER: '#9f8a76',
  MODAL_BUTTON_SECONDARY_HOVER: '#f4f1ea',
  // Modal achievement colors
  MODAL_ACHIEVEMENT_PRIMARY: '#f9c74f',
  MODAL_ACHIEVEMENT_SECONDARY: '#f8961e',
  MODAL_ACHIEVEMENT_BORDER: '#f77f00',
  MODAL_ACHIEVEMENT_TEXT: '#fff',
  // Modal overlay and shadow colors
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.7)',
  MODAL_SHADOW: 'rgba(0, 0, 0, 0.3)',
  MODAL_TEXT_SHADOW_LIGHT: 'rgba(0, 0, 0, 0.1)',
  MODAL_TEXT_SHADOW_DARK: 'rgba(0, 0, 0, 0.3)',
});

const UIColorVariableName = Object.freeze({
  BACKGROUND: '--ui-background-color',
  MODAL_BACKGROUND: '--ui-modal-background-color',
  MODAL_BORDER: '--ui-modal-border-color',
  MODAL_TEXT_PRIMARY: '--ui-modal-text-primary-color',
  MODAL_TEXT_SECONDARY: '--ui-modal-text-secondary-color',
  MODAL_BUTTON_PRIMARY: '--ui-modal-button-primary-color',
  MODAL_BUTTON_PRIMARY_HOVER: '--ui-modal-button-primary-hover-color',
  MODAL_BUTTON_SECONDARY_HOVER: '--ui-modal-button-secondary-hover-color',
  MODAL_ACHIEVEMENT_PRIMARY: '--ui-modal-achievement-primary-color',
  MODAL_ACHIEVEMENT_SECONDARY: '--ui-modal-achievement-secondary-color',
  MODAL_ACHIEVEMENT_BORDER: '--ui-modal-achievement-border-color',
  MODAL_ACHIEVEMENT_TEXT: '--ui-modal-achievement-text-color',
  MODAL_OVERLAY: '--ui-modal-overlay-color',
  MODAL_SHADOW: '--ui-modal-shadow-color',
  MODAL_TEXT_SHADOW_LIGHT: '--ui-modal-text-shadow-light-color',
  MODAL_TEXT_SHADOW_DARK: '--ui-modal-text-shadow-dark-color',
});

/**
 * UI colors for the 2048 game interface
 */
export const UIColor = Object.freeze({
  BACKGROUND: getCSSVariableValueExpression(UIColorVariableName.BACKGROUND),
  MODAL_BACKGROUND: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_BACKGROUND,
  ),
  MODAL_BORDER: getCSSVariableValueExpression(UIColorVariableName.MODAL_BORDER),
  MODAL_TEXT_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_TEXT_PRIMARY,
  ),
  MODAL_TEXT_SECONDARY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_TEXT_SECONDARY,
  ),
  MODAL_BUTTON_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_BUTTON_PRIMARY,
  ),
  MODAL_BUTTON_PRIMARY_HOVER: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_BUTTON_PRIMARY_HOVER,
  ),
  MODAL_BUTTON_SECONDARY_HOVER: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_BUTTON_SECONDARY_HOVER,
  ),
  MODAL_ACHIEVEMENT_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_ACHIEVEMENT_PRIMARY,
  ),
  MODAL_ACHIEVEMENT_SECONDARY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_ACHIEVEMENT_SECONDARY,
  ),
  MODAL_ACHIEVEMENT_BORDER: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_ACHIEVEMENT_BORDER,
  ),
  MODAL_ACHIEVEMENT_TEXT: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_ACHIEVEMENT_TEXT,
  ),
  MODAL_OVERLAY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_OVERLAY,
  ),
  MODAL_SHADOW: getCSSVariableValueExpression(UIColorVariableName.MODAL_SHADOW),
  MODAL_TEXT_SHADOW_LIGHT: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_TEXT_SHADOW_LIGHT,
  ),
  MODAL_TEXT_SHADOW_DARK: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_TEXT_SHADOW_DARK,
  ),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BACKGROUND,
  UIColorValue.BACKGROUND,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_BACKGROUND,
  UIColorValue.MODAL_BACKGROUND,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_BORDER,
  UIColorValue.MODAL_BORDER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_TEXT_PRIMARY,
  UIColorValue.MODAL_TEXT_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_TEXT_SECONDARY,
  UIColorValue.MODAL_TEXT_SECONDARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_BUTTON_PRIMARY,
  UIColorValue.MODAL_BUTTON_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_BUTTON_PRIMARY_HOVER,
  UIColorValue.MODAL_BUTTON_PRIMARY_HOVER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_BUTTON_SECONDARY_HOVER,
  UIColorValue.MODAL_BUTTON_SECONDARY_HOVER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_ACHIEVEMENT_PRIMARY,
  UIColorValue.MODAL_ACHIEVEMENT_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_ACHIEVEMENT_SECONDARY,
  UIColorValue.MODAL_ACHIEVEMENT_SECONDARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_ACHIEVEMENT_BORDER,
  UIColorValue.MODAL_ACHIEVEMENT_BORDER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_ACHIEVEMENT_TEXT,
  UIColorValue.MODAL_ACHIEVEMENT_TEXT,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_OVERLAY,
  UIColorValue.MODAL_OVERLAY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_SHADOW,
  UIColorValue.MODAL_SHADOW,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_TEXT_SHADOW_LIGHT,
  UIColorValue.MODAL_TEXT_SHADOW_LIGHT,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_TEXT_SHADOW_DARK,
  UIColorValue.MODAL_TEXT_SHADOW_DARK,
);
