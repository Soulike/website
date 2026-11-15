import {act, renderHook, waitFor} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from 'vitest';

import {createI18n} from './create-i18n.js';

enum TestStringKey {
  WELCOME = 'WELCOME',
  GREETING = 'GREETING',
  PAIR = 'PAIR',
}

type TestStrings = Record<TestStringKey, string>;

function createConfig() {
  return {
    languageLoaders: {
      en: vi.fn(async () =>
        Promise.resolve<TestStrings>({
          [TestStringKey.WELCOME]: 'Welcome!',
          [TestStringKey.GREETING]: 'Hello, {}!',
          [TestStringKey.PAIR]: '{} and {}',
        }),
      ),
      'zh-cn': vi.fn(async () =>
        Promise.resolve<TestStrings>({
          [TestStringKey.WELCOME]: '欢迎！',
          [TestStringKey.GREETING]: '你好，{}！',
          [TestStringKey.PAIR]: '{} 与 {}',
        }),
      ),
    },
    defaultLanguageCode: 'en',
    placeholderMark: '{}',
  };
}

describe('createI18n', () => {
  let originalNavigatorLanguage: string;
  let mockNavigatorLanguage: string;

  beforeEach(() => {
    originalNavigatorLanguage = navigator.language;
    mockNavigatorLanguage = 'en';
    Object.defineProperty(navigator, 'language', {
      get: () => mockNavigatorLanguage,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      get: () => originalNavigatorLanguage,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('preserves the configured StringKey type on the returned hook and getter', () => {
    const {getI18nString, useI18nString} = createI18n<
      TestStringKey,
      TestStrings
    >(createConfig());

    expectTypeOf(getI18nString).toEqualTypeOf<
      (key: TestStringKey, ...args: string[]) => Promise<string>
    >();
    expectTypeOf(useI18nString).toEqualTypeOf<
      (key: TestStringKey, ...args: string[]) => string
    >();
  });

  it('formats template arguments in getI18nString', async () => {
    const {getI18nString} = createI18n<TestStringKey, TestStrings>(
      createConfig(),
    );

    await expect(getI18nString(TestStringKey.GREETING, 'Alice')).resolves.toBe(
      'Hello, Alice!',
    );
    await expect(
      getI18nString(TestStringKey.PAIR, 'Alice', 'Bob'),
    ).resolves.toBe('Alice and Bob');
  });

  it('preserves template arguments in useI18nString across language changes', async () => {
    const {useI18nString} = createI18n<TestStringKey, TestStrings>(
      createConfig(),
    );
    const renderedValues: string[] = [];
    const {result} = renderHook(() => {
      const value = useI18nString(TestStringKey.GREETING, 'Alice');
      renderedValues.push(value);
      return value;
    });

    await waitFor(() => {
      expect(result.current).toBe('Hello, Alice!');
    });

    mockNavigatorLanguage = 'zh-cn';
    await act(async () => {
      window.dispatchEvent(new Event('languagechange'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current).toBe('你好，Alice！');
    });
    expect(renderedValues).not.toContain('你好，{}！');
  });
});
