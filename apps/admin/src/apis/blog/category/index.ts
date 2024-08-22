import {type Category, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_ALL_ARTICLE_AMOUNT_BY_ID,
  GET_ARTICLE_AMOUNT_BY_ID,
  MODIFY,
} from './ROUTE';

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return Request.JSONToJSON.get(GET_ALL);
}

export async function getAllArticleAmountById(): Promise<
  ServerResponse<Record<number, number>>
> {
  return Request.JSONToJSON.get(GET_ALL_ARTICLE_AMOUNT_BY_ID);
}

export async function getArticleAmountById(
  id: number,
): Promise<ServerResponse<number>> {
  return Request.JSONToJSON.get(GET_ARTICLE_AMOUNT_BY_ID, {
    searchParams: new URLSearchParams({
      json: JSON.stringify({id}),
    }),
  });
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(ADD, {
    body: category,
  });
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(DELETE_BY_ID, {
    body: {id},
  });
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(MODIFY, {
    body: category,
  });
}
