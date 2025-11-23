// Reference: https://developer.hitokoto.cn/sentence/

export interface RequestParameters {
  c?: SentenceCategory[];
  encode?: Encoding;
  charset?: Charset;
  callback?: string;
  select?: string;
  min_length?: number;
  max_length?: number;
}

export interface JsonResponse {
  id: number;
  uuid: string;
  hitokoto: string;
  type: SentenceCategory;
  from: string;
  from_who: string;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: number;
  length: number;
}

export enum SentenceCategory {
  ANIME = 'a',
  COMIC = 'b',
  GAME = 'c',
  LITERATURE = 'd',
  ORIGINAL = 'e',
  FROM_INTERNET = 'f',
  OTHERS = 'g',
  MOVIE = 'h',
  POEM = 'i',
  NETEASE_MUSIC = 'j',
  PHILOSOPHY = 'k',
  SNARKY_ANSWER = 'l',
}

export enum Encoding {
  TEXT = 'text',
  JSON = 'json',
  JS = 'js',
}

export enum Charset {
  UTF8 = 'utf-8',
  GBK = 'gbk',
}
