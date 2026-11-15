import {PLACEHOLDER_MARK} from '../constants.js';
import {STRING_KEY} from '../string-key.js';
import {Strings} from '../Strings.js';

export const EN: Strings = Object.freeze({
  [STRING_KEY.UI_MESSAGE_NETWORK_ERROR]: 'Network error',
  [STRING_KEY.UI_MESSAGE_LOGIN_SUCCESS]: 'Successfully logged in',
  [STRING_KEY.UI_MESSAGE_LOGIN_WRONG_CREDENTIALS]: 'Wrong username or password',

  [STRING_KEY.SERVER_ERROR_INVALID_REQUEST_PARAMS]:
    'Invalid request parameters',
  [STRING_KEY.SERVER_ERROR_INVALID_DATE]: 'Invalid date',
  [STRING_KEY.SERVER_ERROR_UNAUTHORIZED]: 'Please log in first',
  [STRING_KEY.SERVER_ERROR_ACCOUNT_NOT_FOUND]: 'Account does not exist',
  [STRING_KEY.SERVER_ERROR_ACCOUNT_ALREADY_EXISTS]: 'Username already exists',
  [STRING_KEY.SERVER_ERROR_CATEGORY_NOT_FOUND]: 'Category does not exist',
  [STRING_KEY.SERVER_ERROR_CATEGORY_ALREADY_EXISTS]: 'Category already exists',
  [STRING_KEY.SERVER_ERROR_CATEGORY_IN_USE]: `Category is still used by ${PLACEHOLDER_MARK} articles`,
  [STRING_KEY.SERVER_ERROR_ARTICLE_NOT_FOUND]: 'Article does not exist',
  [STRING_KEY.SERVER_ERROR_ARTICLE_TITLE_ALREADY_EXISTS]:
    'Article title already exists',
  [STRING_KEY.SERVER_ERROR_ARTICLE_CATEGORY_NOT_FOUND]:
    'Article category does not exist',

  [STRING_KEY.FIELD_USERNAME]: 'Username',
  [STRING_KEY.FIELD_PASSWORD]: 'Password',
  [STRING_KEY.FIELD_ARTICLE_TITLE]: 'Title',
  [STRING_KEY.FIELD_ARTICLE_CONTENT]: 'Content',
  [STRING_KEY.FIELD_ARTICLE_CATEGORY]: 'Category',
  [STRING_KEY.FIELD_ARTICLE_VISIBILITY]: 'Visibility',
  [STRING_KEY.FIELD_CATEGORY_NAME]: 'Category name',
  [STRING_KEY.FIELD_ABOUT]: 'About',

  [STRING_KEY.VALIDATION_REQUIRED]: `Please enter ${PLACEHOLDER_MARK}`,
  [STRING_KEY.VALIDATION_SELECT_REQUIRED]: `Please select ${PLACEHOLDER_MARK}`,
  [STRING_KEY.VALIDATION_TOO_SMALL]: `${PLACEHOLDER_MARK} must be at least ${PLACEHOLDER_MARK} characters`,
  [STRING_KEY.VALIDATION_TOO_BIG]: `${PLACEHOLDER_MARK} must be at most ${PLACEHOLDER_MARK} characters`,
  [STRING_KEY.VALIDATION_NO_OUTER_WHITESPACE]: `${PLACEHOLDER_MARK} cannot start or end with spaces`,
  [STRING_KEY.VALIDATION_INVALID_FIELD]: `Invalid ${PLACEHOLDER_MARK}`,
  [STRING_KEY.VALIDATION_INVALID_INPUT]: 'Invalid input',
});
