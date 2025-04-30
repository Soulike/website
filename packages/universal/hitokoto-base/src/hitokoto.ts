import {generateRequestUrl} from './v1/helpers.js';
import {Charset, Encoding, SentenceCategory} from './v1/types.js';

class Hitokoto {
  public async getSentence(categories?: SentenceCategory[]) {
    const url = generateRequestUrl({
      c: categories,
      encode: Encoding.TEXT,
      charset: Charset.UTF8,
    });
    const response = await fetch(url, {
      referrer: '',
      credentials: 'omit',
    });
    return response.text();
  }
}

export const hitokoto = new Hitokoto();
export {SentenceCategory};
