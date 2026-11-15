import {useCallback, useEffect, useState} from 'react';

import {I18nCore} from './i18n-core.js';
import type {I18nConfig} from './types.js';
import {I18nEventType} from './types.js';

/**
 * Factory function that creates a type-safe i18n instance with React hooks and utilities.
 *
 * @template StringKey - The type of keys used to look up translations (e.g., enum values)
 * @template KeyToString - The type representing the mapping from keys to strings
 *
 * @param config - Configuration object for i18n
 * @param config.languageLoaders - Record mapping ISO language codes to async loader functions
 * @param config.defaultLanguageCode - Default language code to use as fallback
 * @param config.placeholderMark - Placeholder marker for template strings (e.g., '{}')
 *
 * @returns Object containing:
 *   - `getI18nString`: Async function to get translated strings (for use outside React)
 *   - `useI18nString`: React hook to get translated strings (for use in components)
 *
 * @example
 * ```typescript
 * enum STRING_KEY { WELCOME = 'WELCOME', HELLO_USER = 'HELLO_USER' }
 * type KeyToString = Record<STRING_KEY, string>;
 *
 * const {getI18nString, useI18nString} = createI18n<STRING_KEY, KeyToString>({
 *   languageLoaders: {
 *     'en': async () => ({ [STRING_KEY.WELCOME]: 'Welcome!', [STRING_KEY.HELLO_USER]: 'Hello, {}!' }),
 *     'zh-cn': async () => ({ [STRING_KEY.WELCOME]: '欢迎！', [STRING_KEY.HELLO_USER]: '你好，{}！' })
 *   },
 *   defaultLanguageCode: 'en',
 *   placeholderMark: '{}'
 * });
 *
 * // In React component:
 * const welcome = useI18nString(STRING_KEY.WELCOME);
 * const hello = useI18nString(STRING_KEY.HELLO_USER, 'Alice');
 *
 * // Outside React:
 * const message = await getI18nString(STRING_KEY.WELCOME);
 * ```
 */
export function createI18n<
  StringKey extends PropertyKey,
  KeyToString extends Record<StringKey, string>,
>(config: I18nConfig<StringKey, KeyToString>) {
  const i18nCore = new I18nCore<StringKey, KeyToString>(config);

  async function getI18nString(
    key: StringKey,
    ...args: string[]
  ): Promise<string> {
    await i18nCore.ensureStringsLoaded();
    return i18nCore.getString(key, ...args);
  }

  const boundUseI18nString = useI18nStringWithCore<StringKey, KeyToString>;
  const useI18nString = boundUseI18nString.bind(null, i18nCore);

  return {
    getI18nString,
    useI18nString,
  };
}

function useI18nStringWithCore<
  StringKey extends PropertyKey,
  KeyToString extends Record<StringKey, string>,
>(
  i18nCore: I18nCore<StringKey, KeyToString>,
  key: StringKey,
  ...args: string[]
): string {
  const [string, setString] = useState('');

  const languageChangeCallback = useCallback(() => {
    setString(i18nCore.getString(key, ...args));
  }, [args, i18nCore, key]);

  useEffect(() => {
    i18nCore
      .ensureStringsLoaded()
      .then(() => {
        setString(i18nCore.getString(key, ...args));
      })
      .catch((e: unknown) => {
        console.error(e);
      });

    i18nCore.addEventListener(
      I18nEventType.LANGUAGE_CHANGE,
      languageChangeCallback,
    );
    return () => {
      i18nCore.removeEventListener(
        I18nEventType.LANGUAGE_CHANGE,
        languageChangeCallback,
      );
    };
  }, [args, i18nCore, key, languageChangeCallback]);

  return string;
}
