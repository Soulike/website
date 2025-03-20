import {i18nCore} from './i18n-core.js';
import {STRING_KEY} from './string-key.js';

export async function getI18nString(key: STRING_KEY) {
  await i18nCore.ensureStringsLoaded();
  return i18nCore.getString(key);
}
