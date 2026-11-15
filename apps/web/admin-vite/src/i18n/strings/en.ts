import {PLACEHOLDER_MARK} from '../constants.js';
import {STRING_KEY} from '../string-key.js';
import {Strings} from '../Strings.js';

export const EN: Strings = Object.freeze({
  [STRING_KEY.UI_MESSAGE_NETWORK_ERROR]: 'Network error',
  [STRING_KEY.UI_MESSAGE_LOGIN_SUCCESS]: 'Successfully logged in',
  [STRING_KEY.UI_MESSAGE_LOGIN_WRONG_CREDENTIALS]: 'Wrong username or password',

  [STRING_KEY.FIELD_USERNAME]: 'Username',
  [STRING_KEY.FIELD_PASSWORD]: 'Password',

  [STRING_KEY.VALIDATION_REQUIRED]: `Please enter ${PLACEHOLDER_MARK}`,
  [STRING_KEY.VALIDATION_TOO_SMALL]: `${PLACEHOLDER_MARK} must be at least ${PLACEHOLDER_MARK} characters`,
  [STRING_KEY.VALIDATION_TOO_BIG]: `${PLACEHOLDER_MARK} must be at most ${PLACEHOLDER_MARK} characters`,
  [STRING_KEY.VALIDATION_NO_OUTER_WHITESPACE]: `${PLACEHOLDER_MARK} cannot start or end with spaces`,
  [STRING_KEY.VALIDATION_INVALID_FIELD]: `Invalid ${PLACEHOLDER_MARK}`,
  [STRING_KEY.VALIDATION_INVALID_INPUT]: 'Invalid input',
});
