import {PLACEHOLDER_MARK} from '../constants.js';
import {getPageTitle} from '../helpers/page-title-helpers.js';
import {STRING_KEY} from '../string-key.js';
import {Strings} from './Strings.js';

export const EN: Strings = Object.freeze({
  [STRING_KEY.TEST_STRING]: 'Test string',
  [STRING_KEY.TEST_TEMPLATE_STRING]: 'a{}c{}e',
  [STRING_KEY.TEST_TEMPLATE_STRING_FILLED]: 'abcde',

  [STRING_KEY.SITE_TITLE]: `Soulike's Blog`,
  get [STRING_KEY.PAGE_TITLE_INDEX]() {
    return EN[STRING_KEY.SITE_TITLE];
  },
  get [STRING_KEY.PAGE_TITLE_ABOUT]() {
    return getPageTitle(
      EN[STRING_KEY.UI_LABEL_ABOUT],
      EN[STRING_KEY.SITE_TITLE],
    );
  },

  [STRING_KEY.UI_MESSAGE_NETWORK_ERROR]: 'Network error',
  [STRING_KEY.UI_MESSAGE_ARTICLE_MAYBE_OUTDATED]: `Last edited ${PLACEHOLDER_MARK} days ago. Content may be outdated.`,

  [STRING_KEY.UI_LABEL_INDEX]: 'Index',
  [STRING_KEY.UI_LABEL_CATEGORY]: 'Category',
  [STRING_KEY.UI_LABEL_ABOUT]: 'About',
});
