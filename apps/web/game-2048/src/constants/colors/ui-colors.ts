import {
  getCSSVariableValueExpression,
  setCSSVariableValue,
} from '@/helpers/css-helpers.js';

/**
 * UI color values for the 2048 game interface
 */
export const UIColorValue = Object.freeze({
  BACKGROUND: '#eee4da',
  // Universal modal colors
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.7)',
  MODAL_BACKGROUND: '#faf8ef',
  MODAL_BORDER: '#bbada0',
  MODAL_SHADOW: 'rgba(0, 0, 0, 0.3)',
  // Universal button colors
  BUTTON_PRIMARY: '#8f7a66',
  BUTTON_PRIMARY_HOVER: '#9f8a76',
  BUTTON_PRIMARY_TEXT: '#faf8ef',
  BUTTON_SECONDARY: '#eee4da',
  BUTTON_SECONDARY_HOVER: '#f4f1ea',
  BUTTON_SECONDARY_TEXT: '#8f7a66',
  BUTTON_BORDER: '#bbada0',
  BUTTON_DISABLED_TEXT: '#bbada0',
  // Game over modal specific colors
  GAME_OVER_TEXT_PRIMARY: '#776e65',
  GAME_OVER_TEXT_SECONDARY: '#8f7a66',
  GAME_OVER_TEXT_SHADOW_LIGHT: 'rgba(0, 0, 0, 0.1)',
  GAME_OVER_TEXT_SHADOW_DARK: 'rgba(0, 0, 0, 0.3)',
  GAME_OVER_ACHIEVEMENT_PRIMARY: '#f9c74f',
  GAME_OVER_ACHIEVEMENT_SECONDARY: '#f8961e',
  GAME_OVER_ACHIEVEMENT_BORDER: '#f77f00',
  GAME_OVER_ACHIEVEMENT_TEXT: '#fff',
});

const UIColorVariableName = Object.freeze({
  BACKGROUND: '--ui-background-color',
  // Universal modal colors
  MODAL_OVERLAY: '--ui-modal-overlay-color',
  MODAL_BACKGROUND: '--ui-modal-background-color',
  MODAL_BORDER: '--ui-modal-border-color',
  MODAL_SHADOW: '--ui-modal-shadow-color',
  // Universal button colors
  BUTTON_PRIMARY: '--ui-button-primary-color',
  BUTTON_PRIMARY_HOVER: '--ui-button-primary-hover-color',
  BUTTON_PRIMARY_TEXT: '--ui-button-primary-text-color',
  BUTTON_SECONDARY: '--ui-button-secondary-color',
  BUTTON_SECONDARY_HOVER: '--ui-button-secondary-hover-color',
  BUTTON_SECONDARY_TEXT: '--ui-button-secondary-text-color',
  BUTTON_BORDER: '--ui-button-border-color',
  BUTTON_DISABLED_TEXT: '--ui-button-disabled-text-color',
  // Game over modal specific colors
  GAME_OVER_TEXT_PRIMARY: '--ui-game-over-text-primary-color',
  GAME_OVER_TEXT_SECONDARY: '--ui-game-over-text-secondary-color',
  GAME_OVER_TEXT_SHADOW_LIGHT: '--ui-game-over-text-shadow-light-color',
  GAME_OVER_TEXT_SHADOW_DARK: '--ui-game-over-text-shadow-dark-color',
  GAME_OVER_ACHIEVEMENT_PRIMARY: '--ui-game-over-achievement-primary-color',
  GAME_OVER_ACHIEVEMENT_SECONDARY: '--ui-game-over-achievement-secondary-color',
  GAME_OVER_ACHIEVEMENT_BORDER: '--ui-game-over-achievement-border-color',
  GAME_OVER_ACHIEVEMENT_TEXT: '--ui-game-over-achievement-text-color',
});

/**
 * UI colors for the 2048 game interface
 */
export const UIColor = Object.freeze({
  BACKGROUND: getCSSVariableValueExpression(UIColorVariableName.BACKGROUND),
  // Universal modal colors
  MODAL_OVERLAY: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_OVERLAY,
  ),
  MODAL_BACKGROUND: getCSSVariableValueExpression(
    UIColorVariableName.MODAL_BACKGROUND,
  ),
  MODAL_BORDER: getCSSVariableValueExpression(UIColorVariableName.MODAL_BORDER),
  MODAL_SHADOW: getCSSVariableValueExpression(UIColorVariableName.MODAL_SHADOW),
  // Universal button colors
  BUTTON_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_PRIMARY,
  ),
  BUTTON_PRIMARY_HOVER: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_PRIMARY_HOVER,
  ),
  BUTTON_PRIMARY_TEXT: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_PRIMARY_TEXT,
  ),
  BUTTON_SECONDARY: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_SECONDARY,
  ),
  BUTTON_SECONDARY_HOVER: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_SECONDARY_HOVER,
  ),
  BUTTON_SECONDARY_TEXT: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_SECONDARY_TEXT,
  ),
  BUTTON_BORDER: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_BORDER,
  ),
  BUTTON_DISABLED_TEXT: getCSSVariableValueExpression(
    UIColorVariableName.BUTTON_DISABLED_TEXT,
  ),
  // Game over modal specific colors
  GAME_OVER_TEXT_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_TEXT_PRIMARY,
  ),
  GAME_OVER_TEXT_SECONDARY: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_TEXT_SECONDARY,
  ),
  GAME_OVER_TEXT_SHADOW_LIGHT: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_TEXT_SHADOW_LIGHT,
  ),
  GAME_OVER_TEXT_SHADOW_DARK: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_TEXT_SHADOW_DARK,
  ),
  GAME_OVER_ACHIEVEMENT_PRIMARY: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_ACHIEVEMENT_PRIMARY,
  ),
  GAME_OVER_ACHIEVEMENT_SECONDARY: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_ACHIEVEMENT_SECONDARY,
  ),
  GAME_OVER_ACHIEVEMENT_BORDER: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_ACHIEVEMENT_BORDER,
  ),
  GAME_OVER_ACHIEVEMENT_TEXT: getCSSVariableValueExpression(
    UIColorVariableName.GAME_OVER_ACHIEVEMENT_TEXT,
  ),
});

const rootElement = document.documentElement;
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BACKGROUND,
  UIColorValue.BACKGROUND,
);
// Universal modal colors
setCSSVariableValue(
  rootElement,
  UIColorVariableName.MODAL_OVERLAY,
  UIColorValue.MODAL_OVERLAY,
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
  UIColorVariableName.MODAL_SHADOW,
  UIColorValue.MODAL_SHADOW,
);
// Universal button colors
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_PRIMARY,
  UIColorValue.BUTTON_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_PRIMARY_HOVER,
  UIColorValue.BUTTON_PRIMARY_HOVER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_PRIMARY_TEXT,
  UIColorValue.BUTTON_PRIMARY_TEXT,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_SECONDARY,
  UIColorValue.BUTTON_SECONDARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_SECONDARY_HOVER,
  UIColorValue.BUTTON_SECONDARY_HOVER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_SECONDARY_TEXT,
  UIColorValue.BUTTON_SECONDARY_TEXT,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_BORDER,
  UIColorValue.BUTTON_BORDER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.BUTTON_DISABLED_TEXT,
  UIColorValue.BUTTON_DISABLED_TEXT,
);
// Game over modal specific colors
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_TEXT_PRIMARY,
  UIColorValue.GAME_OVER_TEXT_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_TEXT_SECONDARY,
  UIColorValue.GAME_OVER_TEXT_SECONDARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_TEXT_SHADOW_LIGHT,
  UIColorValue.GAME_OVER_TEXT_SHADOW_LIGHT,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_TEXT_SHADOW_DARK,
  UIColorValue.GAME_OVER_TEXT_SHADOW_DARK,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_ACHIEVEMENT_PRIMARY,
  UIColorValue.GAME_OVER_ACHIEVEMENT_PRIMARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_ACHIEVEMENT_SECONDARY,
  UIColorValue.GAME_OVER_ACHIEVEMENT_SECONDARY,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_ACHIEVEMENT_BORDER,
  UIColorValue.GAME_OVER_ACHIEVEMENT_BORDER,
);
setCSSVariableValue(
  rootElement,
  UIColorVariableName.GAME_OVER_ACHIEVEMENT_TEXT,
  UIColorValue.GAME_OVER_ACHIEVEMENT_TEXT,
);
