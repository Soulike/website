import {getPageTitle} from '../helpers/page-title-helpers.js';
import {STRING_KEY} from '../string-key.js';
import {Strings} from './Strings.js';

export const ZH_CN: Strings = Object.freeze({
  [STRING_KEY.TEST_STRING]: '测试字符串',

  [STRING_KEY.SITE_TITLE]: `Soulike 的博客`,
  get [STRING_KEY.PAGE_TITLE_INDEX]() {
    return ZH_CN[STRING_KEY.SITE_TITLE];
  },
  get [STRING_KEY.PAGE_TITLE_ABOUT]() {
    return getPageTitle(
      ZH_CN[STRING_KEY.UI_LABEL_ABOUT],
      ZH_CN[STRING_KEY.SITE_TITLE],
    );
  },

  [STRING_KEY.UI_MESSAGE_NETWORK_ERROR]: '网络错误',
  [STRING_KEY.UI_LABEL_INDEX]: '首页',
  [STRING_KEY.UI_LABEL_CATEGORY]: '类别',
  [STRING_KEY.UI_LABEL_ABOUT]: '关于',
});
