import {LanguageCode} from '../language-code.js';
import {Strings} from './Strings.js';

export async function loadStringsForLanguageCode(
  languageCode: string,
): Promise<Strings> {
  languageCode = languageCode.toLowerCase();
  if (languageCode === LanguageCode.ZH_CN) {
    const {ZH_CN} = await import('./zh-cn.js');
    return ZH_CN;
  } else {
    const {EN} = await import('./en.js');
    return EN;
  }
}
