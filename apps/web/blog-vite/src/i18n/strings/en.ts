import {PLACEHOLDER_MARK} from '../constants.js';
import {getPageTitle} from '../helpers/page-title-helpers.js';
import {STRING_KEY} from '../string-key.js';
import {Strings} from '../Strings.js';

export const EN: Strings = Object.freeze({
  [STRING_KEY.SITE_TITLE]: `Soulike's Blog`,
  get [STRING_KEY.PAGE_TITLE_INDEX]() {
    return EN[STRING_KEY.SITE_TITLE];
  },
  get [STRING_KEY.PAGE_TITLE_ARTICLE]() {
    return getPageTitle(PLACEHOLDER_MARK, EN[STRING_KEY.SITE_TITLE]);
  },
  get [STRING_KEY.PAGE_TITLE_ABOUT]() {
    return getPageTitle(
      EN[STRING_KEY.UI_LABEL_ABOUT],
      EN[STRING_KEY.SITE_TITLE],
    );
  },

  [STRING_KEY.UI_MESSAGE_NETWORK_ERROR]: 'Network error',
  [STRING_KEY.UI_MESSAGE_ARTICLE_MAYBE_OUTDATED]: `Last edited ${PLACEHOLDER_MARK} days ago. Content may be outdated.`,

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

  [STRING_KEY.UI_LABEL_INDEX]: 'Index',
  [STRING_KEY.UI_LABEL_CATEGORY]: 'Category',
  [STRING_KEY.UI_LABEL_ABOUT]: 'About',
  [STRING_KEY.UI_LABEL_LOADING]: 'Loading',
});
