import {type Article, type ServerResponse} from '@module/classes';

import {databaseRequest} from '../CONFIG.js';
import {
  ADD,
  ADD_PAGE_VIEW,
  COUNT,
  COUNT_ALL,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  GET_BY_DATE,
  MODIFY,
} from './ROUTE.js';

export async function add(
  article: Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>,
): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(ADD, article);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(DELETE_BY_ID, {
    id,
  });
}

export async function modify(
  article: Pick<Article, 'id'> &
    Partial<
      Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
    >,
): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(MODIFY, article);
}

export async function get(
  article: Partial<Article>,
): Promise<ServerResponse<Article[]>> {
  return databaseRequest.get<ServerResponse<Article[]>>(GET, {
    json: JSON.stringify(article),
  });
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  return databaseRequest.get<ServerResponse<Article[]>>(GET_ALL);
}

export async function getByDate(
  year: number,
  month?: number,
  day?: number,
): Promise<ServerResponse<Article[]>> {
  return databaseRequest.get<ServerResponse<Article[]>>(GET_BY_DATE, {
    json: JSON.stringify({year, month, day}),
  });
}

export async function count(
  article: Partial<Article>,
): Promise<ServerResponse<number>> {
  return databaseRequest.get<ServerResponse<number>>(COUNT, {
    json: JSON.stringify(article),
  });
}

export async function countAll(): Promise<ServerResponse<number>> {
  return databaseRequest.get<ServerResponse<number>>(COUNT_ALL);
}

export async function addPageView(id: number): Promise<ServerResponse<void>> {
  return databaseRequest.post<ServerResponse<void>>(ADD_PAGE_VIEW, {
    id,
  });
}
