import {STRING_KEY} from '@website/i18n-base';
import {useCallback, useEffect, useState} from 'react';

import {i18nCore, I18nEventType} from './i18n-core.js';
import {Strings} from './strings/Strings.js';

export function useI18nString(key: STRING_KEY, ...args: string[]) {
  const [string, setString] = useState('');

  const languageChangeCallback = useCallback(
    (strings: Strings) => {
      setString(strings[key]);
    },
    [key],
  );

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
  }, [args, key, languageChangeCallback]);

  return string;
}
