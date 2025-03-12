import {STRING_KEY} from './string-key.js';
import {loadStringsForLanguageCode} from './strings/index.js';

export async function getI18nString(key: STRING_KEY) {
  const languageCode = navigator.language;
  const strings = await loadStringsForLanguageCode(languageCode);
  return strings[key];
}
