import {describe, expectTypeOf, it, vi} from 'vitest';

import {createI18n} from './create-i18n.js';

enum TestStringKey {
  WELCOME = 'WELCOME',
}

type TestStrings = Record<TestStringKey, string>;

describe('createI18n', () => {
  it('preserves the configured StringKey type on the returned hook and getter', () => {
    const {getI18nString, useI18nString} = createI18n<
      TestStringKey,
      TestStrings
    >({
      languageLoaders: {
        en: vi.fn(async () =>
          Promise.resolve({[TestStringKey.WELCOME]: 'Welcome!'}),
        ),
      },
      defaultLanguageCode: 'en',
      placeholderMark: '{}',
    });

    expectTypeOf(getI18nString).toEqualTypeOf<
      (key: TestStringKey) => Promise<string>
    >();
    expectTypeOf(useI18nString).toEqualTypeOf<
      (key: TestStringKey, ...args: string[]) => string
    >();
  });
});
