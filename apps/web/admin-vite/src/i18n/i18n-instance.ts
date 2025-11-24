import {createI18n} from '@library/i18n';

import {PLACEHOLDER_MARK} from './constants.js';
import {LanguageCode} from './language-code.js';
import {STRING_KEY} from './string-key.js';
import {Strings} from './Strings.js';

export const {getI18nString, useI18nString} = createI18n<STRING_KEY, Strings>({
  languageLoaders: {
    [LanguageCode.ZH_CN]: async () => {
      const {ZH_CN} = await import('./strings/zh-cn.js');
      return ZH_CN;
    },
    [LanguageCode.EN]: async () => {
      const {EN} = await import('./strings/en.js');
      return EN;
    },
  },
  defaultLanguageCode: LanguageCode.EN,
  placeholderMark: PLACEHOLDER_MARK,
});
