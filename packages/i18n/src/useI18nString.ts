import {useCallback, useEffect, useState} from 'react';

import {LanguageCode} from './language-code.js';
import {STRING_KEY} from './string-key.js';
import {Strings} from './strings/Strings.js';

export function useI18nString(key: STRING_KEY) {
  const [strings, setStrings] = useState<Strings | null>(null);

  const loadStrings = useCallback(async () => {
    const languageCode = navigator.language;
    const strings = await loadStringsForLanguage(languageCode);
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

async function loadStringsForLanguage(languageCode: string): Promise<Strings> {
  languageCode = languageCode.toLowerCase();
  if (languageCode === LanguageCode.ZH_CN) {
    const {ZH_CN} = await import('./strings/zh-cn.js');
    return ZH_CN;
  } else {
    const {EN} = await import('./strings/en.js');
    return EN;
  }
}
