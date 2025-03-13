import {useCallback, useEffect, useState} from 'react';

import {i18nCore, I18nEventType} from './i18n-core.js';
import {STRING_KEY} from './string-key.js';
import {Strings} from './strings/Strings.js';

export function useI18nString(key: STRING_KEY) {
  const [string, setString] = useState('');

  const languageChangeCallback = useCallback(
    (strings: Strings) => {
      setString(strings[key]);
    },
    [key],
  );

  useEffect(() => {
    setString(i18nCore.getString(key));
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
  }, [key, languageChangeCallback]);

  return string;
}
