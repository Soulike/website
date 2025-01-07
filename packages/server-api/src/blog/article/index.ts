import {type Article, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {
  ADD,
  DELETE_BY_ID,
  GET_ALL,
  GET_BY_CATEGORY,
  GET_BY_ID,
  MODIFY,
} from './paths.js';

export async function getById(id: number): Promise<ServerResponse<Article>> {
  return Request.JSONToJSON.get(GET_BY_ID, {
    searchParams: new URLSearchParams({json: JSON.stringify({id})}),
  });
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  return Request.JSONToJSON.get(GET_ALL);
}

export async function getByCategory(
  category: number,
): Promise<ServerResponse<Article[]>> {
  return Request.JSONToJSON.get(GET_BY_CATEGORY, {
    searchParams: new URLSearchParams({
      json: JSON.stringify({category}),
    }),
  });
}

export async function add(
  article: Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>,
): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(ADD, {
    body: article,
  });
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(DELETE_BY_ID, {
    body: {id},
  });
}

export async function modify(
  article: Pick<Article, 'id'> &
    Partial<
      Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
    >,
): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(MODIFY, {
    body: article,
  });
}
