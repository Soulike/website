import {act, renderHook} from '@testing-library/react';
import {beforeEach, describe, expect, test} from 'vitest';

import {STRING_KEY} from './string-key.js';
import {EN} from './strings/en.js';
import {ZH_CN} from './strings/zh-cn.js';
import {changeNavigatorLanguage} from './test-helper.js';
import {useI18nString} from './useI18nString.js';

describe('useI18nString', () => {
  beforeEach(async () => {
    await changeNavigatorLanguage('en');
  });

  test('Should handle language change', async () => {
    const {result} = renderHook(() => useI18nString(STRING_KEY.TEST_STRING));
    expect(result.current).toEqual(EN.TEST_STRING);
    await act(async () => {
      await changeNavigatorLanguage('zh-CN');
    });
    expect(result.current).toEqual(ZH_CN.TEST_STRING);
  });
});
