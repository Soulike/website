import {RequestParameters} from './types.js';

export function generateRequestUrl(parameters: RequestParameters): URL {
  const url = new URL('https://v1.hitokoto.cn/');

  const parameterEntries: readonly [
    keyof RequestParameters,
    RequestParameters[keyof RequestParameters],
  ][] = [
    ['c', parameters.c],
    ['encode', parameters.encode],
    ['charset', parameters.charset],
    ['callback', parameters.callback],
    ['select', parameters.select],
    ['min_length', parameters.min_length],
    ['max_length', parameters.max_length],
  ];
  const searchParams = url.searchParams;
  for (const [key, value] of parameterEntries) {
    if (value === undefined) {
      continue;
    }

    if (value instanceof Array) {
      for (const v of value) {
        searchParams.append(key, v);
      }
      continue;
    }

    searchParams.append(key, value.toString());
  }

  return url;
}
