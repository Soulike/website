import {STRING_KEY} from '@website/i18n-base';

import {i18nCore} from './i18n-core.js';

export async function getI18nString(key: STRING_KEY) {
  await i18nCore.ensureStringsLoaded();
  return i18nCore.getString(key);
}
