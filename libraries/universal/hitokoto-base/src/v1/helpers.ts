import {RequestParameters} from './types.js';

export function generateRequestUrl(parameters: RequestParameters): URL {
  const url = new URL('https://v1.hitokoto.cn/');

  const sanitizedParameters = sanitizeRequestParameters(parameters);
  const sanitizedParametersEntries = Object.entries(sanitizedParameters) as [
    keyof RequestParameters,
    RequestParameters[keyof RequestParameters],
  ][];
  const searchParams = url.searchParams;
  for (const [key, value] of sanitizedParametersEntries) {
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

function sanitizeRequestParameters(
  parameters: RequestParameters,
): RequestParameters {
  const {c, encode, charset, callback, select, min_length, max_length} =
    parameters;
  return {
    c,
    encode,
    charset,
    callback,
    select,
    min_length,
    max_length,
  } as RequestParameters;
}
