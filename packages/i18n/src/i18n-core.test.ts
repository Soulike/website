import {beforeEach, describe, expect, test, vi} from 'vitest';

import {i18nCore, I18nEventType} from './i18n-core.js';
import {STRING_KEY} from './string-key.js';
import {EN} from './strings/en.js';
import {ZH_CN} from './strings/zh-cn.js';
import {changeNavigatorLanguage} from './test-helper.js';

describe('I18nCore', () => {
  beforeEach(async () => {
    await changeNavigatorLanguage('en');
  });

  test('Should load strings', () => {
    expect(i18nCore.getString(STRING_KEY.TEST_STRING)).toEqual(
      EN[STRING_KEY.TEST_STRING],
    );
  });

  test('Should handle language change', async () => {
    expect(i18nCore.getString(STRING_KEY.TEST_STRING)).toEqual(
      EN[STRING_KEY.TEST_STRING],
    );
    await changeNavigatorLanguage('zh-CN');
    expect(i18nCore.getString(STRING_KEY.TEST_STRING)).toEqual(
      ZH_CN[STRING_KEY.TEST_STRING],
    );
  });

  test('Should load English if strings is not available for language', async () => {
    await changeNavigatorLanguage('ja');
    expect(i18nCore.getString(STRING_KEY.TEST_STRING)).toEqual(
      EN[STRING_KEY.TEST_STRING],
    );
  });

  test('Should call available event listeners when language changes', async () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    i18nCore.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener1);
    i18nCore.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener2);
    await changeNavigatorLanguage('zh-CN');
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    i18nCore.removeEventListener(I18nEventType.LANGUAGE_CHANGE, listener1);
    await changeNavigatorLanguage('en');
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(2);
  });
});
