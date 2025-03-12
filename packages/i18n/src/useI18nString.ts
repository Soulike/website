import {useCallback, useEffect, useState} from 'react';

import {STRING_KEY} from './string-key.js';
import {loadStringsForLanguageCode} from './strings/index.js';
import {Strings} from './strings/Strings.js';

export function useI18nString(key: STRING_KEY) {
  const [strings, setStrings] = useState<Strings | null>(null);

  const loadStrings = useCallback(async () => {
    const languageCode = navigator.language;
    const strings = await loadStringsForLanguageCode(languageCode);
    setStrings(strings);
  }, []);

  useEffect(() => {
    void loadStrings();
    window.addEventListener('languagechange', () => {
      void loadStrings();
    });
  }, [loadStrings]);

  return strings?.[key] ?? '';
}
