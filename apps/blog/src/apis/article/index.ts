import {type Article} from '@website/classes';
import * as request from '@website/request';
import {message} from 'antd';

import {
  GET_ALL_WITH_ABSTRACT,
  GET_BY_CATEGORY_WITH_ABSTRACT,
  GET_BY_ID,
} from './ROUTE';

export async function getAllWithAbstract(): Promise<Article[] | null> {
  return await request.getServerResponse(GET_ALL_WITH_ABSTRACT, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function getById(id: number): Promise<Article | null> {
  return await request.getServerResponse(GET_BY_ID, {
    urlSearchParams: new URLSearchParams({
      json: JSON.stringify({id}),
    }),
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function getByCategoryWithAbstract(
  category: number,
): Promise<Article[] | null> {
  return await request.getServerResponse(GET_BY_CATEGORY_WITH_ABSTRACT, {
    urlSearchParams: new URLSearchParams({
      json: JSON.stringify({category}),
    }),
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}
