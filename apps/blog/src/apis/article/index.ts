import {type Article, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {
  GET_ALL_WITH_ABSTRACT,
  GET_BY_CATEGORY_WITH_ABSTRACT,
  GET_BY_ID,
} from './ROUTE';

export async function getAllWithAbstract(): Promise<ServerResponse<Article[]>> {
  return Request.JSONToJSON.get(GET_ALL_WITH_ABSTRACT);
}

export async function getById(id: number): Promise<ServerResponse<Article>> {
  return Request.JSONToJSON.get(GET_BY_ID, {
    searchParams: new URLSearchParams({
      json: JSON.stringify({id}),
    }),
  });
}

export async function getByCategoryWithAbstract(
  category: number,
): Promise<ServerResponse<Article[]>> {
  return Request.JSONToJSON.get(GET_BY_CATEGORY_WITH_ABSTRACT, {
    searchParams: new URLSearchParams({
      json: JSON.stringify({category}),
    }),
  });
}
