import {type Category, type ServerResponse} from '@module/classes';

import {databaseRequest} from '../CONFIG.js';
import {
  ADD,
  COUNT_ARTICLE_BY_ID,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  MODIFY,
} from './ROUTE.js';

export async function get(
  category: Partial<Category>,
): Promise<ServerResponse<Category[]>> {
  return databaseRequest.get<ServerResponse<Category[]>>(GET, {
    json: JSON.stringify(category),
  });
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return databaseRequest.get<ServerResponse<Category[]>>(GET_ALL);
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(ADD, category);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(DELETE_BY_ID, {
    id,
  });
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(MODIFY, category);
}

export async function countArticleById(
  id: number,
): Promise<ServerResponse<number>> {
  return databaseRequest.get<ServerResponse<number>>(COUNT_ARTICLE_BY_ID, {
    json: JSON.stringify({id}),
  });
}
