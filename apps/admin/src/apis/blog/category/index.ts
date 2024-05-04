import {type Category} from '@website/classes';
import * as request from '@website/request';
import {message} from 'antd';

import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_ALL_ARTICLE_AMOUNT_BY_ID,
  GET_ARTICLE_AMOUNT_BY_ID,
  MODIFY,
} from './ROUTE';

export async function getAll(): Promise<Category[] | null> {
  return await request.getServerResponse(GET_ALL, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function getAllArticleAmountById(): Promise<Record<
  number,
  number
> | null> {
  return await request.getServerResponse(GET_ALL_ARTICLE_AMOUNT_BY_ID, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function getArticleAmountById(id: number): Promise<number | null> {
  return await request.getServerResponse(GET_ARTICLE_AMOUNT_BY_ID, {
    urlSearchParams: new URLSearchParams({
      json: JSON.stringify({id}),
    }),
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<true | null> {
  return await request.postServerResponse(ADD, category, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function deleteById(id: number): Promise<true | null> {
  return await request.postServerResponse(
    DELETE_BY_ID,
    {id},
    {
      onRequestFail: (msg) => message.warning(msg),
      onRequestError: (msg) => message.error(msg),
    },
  );
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<true | null> {
  return await request.postServerResponse(MODIFY, category, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}
