import {i18nCore} from '../i18n-core.js';

export async function changeNavigatorLanguage(language: string) {
  Object.defineProperty(navigator, 'language', {
    get: () => language,
    configurable: true,
  });
  window.dispatchEvent(new Event('languagechange'));
  await i18nCore.ensureStringsLoaded();
}
