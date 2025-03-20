import {beforeEach, describe, expect, test} from 'vitest';

import {i18nCore} from './i18n-core';
import {STRING_KEY} from './string-key.js';
import {EN} from './strings/en.js';
import {ZH_CN} from './strings/zh-cn.js';

describe('I18nCore', () => {
  beforeEach(async () => {
    changeNavigatorLanguage('en');
    await i18nCore.ensureStringsLoaded();
  });

  test('Should load strings', () => {
    expect(
      i18nCore.getString(STRING_KEY.TEST_STRING),
      EN[STRING_KEY.TEST_STRING],
    );
  });

  test('Should handle language change', () => {
    expect(
      i18nCore.getString(STRING_KEY.TEST_STRING),
      EN[STRING_KEY.TEST_STRING],
    );
    changeNavigatorLanguage('zh-CN');
    expect(
      i18nCore.getString(STRING_KEY.TEST_STRING),
      ZH_CN[STRING_KEY.TEST_STRING],
    );
  });
});

function changeNavigatorLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', {
    get: () => language,
    configurable: true,
  });

  window.dispatchEvent(new Event('languagechange'));
}
