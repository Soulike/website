import {describe, expect, it} from 'vitest';

import {generateRequestUrl} from './helpers.js';
import {
  Charset,
  Encoding,
  RequestParameters,
  SentenceCategory,
} from './types.js';

describe('generateRequestUrl', () => {
  it('should generate URL with no parameters', () => {
    const parameters: RequestParameters = {};
    const url = generateRequestUrl(parameters);
    expect(url.toString()).toBe('https://v1.hitokoto.cn/');
  });

  it('should generate URL with single parameter', () => {
    const parameters: RequestParameters = {encode: Encoding.JSON};
    const url = generateRequestUrl(parameters);
    expect(url.toString()).toBe('https://v1.hitokoto.cn/?encode=json');
  });

  it('should generate URL with multiple parameters', () => {
    const parameters: RequestParameters = {
      c: [SentenceCategory.ANIME, SentenceCategory.GAME],
      charset: Charset.UTF8,
      min_length: 5,
      max_length: 20,
    };
    const url = generateRequestUrl(parameters);
    expect(url.toString()).toBe(
      'https://v1.hitokoto.cn/?c=a&c=c&charset=utf-8&min_length=5&max_length=20',
    );
  });

  it('should ignore undefined parameters', () => {
    const parameters: RequestParameters = {
      c: [SentenceCategory.ANIME],
      encode: undefined,
      charset: Charset.UTF8,
    };
    const url = generateRequestUrl(parameters);
    expect(url.toString()).toBe('https://v1.hitokoto.cn/?c=a&charset=utf-8');
  });

  it('should handle array parameters correctly', () => {
    const parameters: RequestParameters = {
      c: [SentenceCategory.ANIME, SentenceCategory.GAME],
    };
    const url = generateRequestUrl(parameters);
    expect(url.toString()).toBe('https://v1.hitokoto.cn/?c=a&c=c');
  });
});
