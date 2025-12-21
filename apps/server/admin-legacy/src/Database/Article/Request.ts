import {type Article, type ServerResponse} from '@module/classes';

import {axiosInstance} from '../CONFIG.js';
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
  const {data} = await axiosInstance.post<ServerResponse<void>>(ADD, article);
  return data;
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(DELETE_BY_ID, {
    id,
  });
  return data;
}

export async function modify(
  article: Pick<Article, 'id'> &
    Partial<
      Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
    >,
): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(
    MODIFY,
    article,
  );
  return data;
}

export async function get(
  article: Partial<Article>,
): Promise<ServerResponse<Article[]>> {
  const {data} = await axiosInstance.get<ServerResponse<Article[]>>(GET, {
    params: {
      json: JSON.stringify(article),
    },
  });
  return data;
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  const {data} = await axiosInstance.get<ServerResponse<Article[]>>(GET_ALL);
  return data;
}

export async function getByDate(
  year: number,
  month?: number,
  day?: number,
): Promise<ServerResponse<Article[]>> {
  const {data} = await axiosInstance.get<ServerResponse<Article[]>>(
    GET_BY_DATE,
    {
      params: {
        json: JSON.stringify({year, month, day}),
      },
    },
  );
  return data;
}

export async function count(
  article: Partial<Article>,
): Promise<ServerResponse<number>> {
  const {data} = await axiosInstance.get<ServerResponse<number>>(COUNT, {
    params: {
      json: JSON.stringify(article),
    },
  });
  return data;
}

export async function countAll(): Promise<ServerResponse<number>> {
  const {data} = await axiosInstance.get<ServerResponse<number>>(COUNT_ALL);
  return data;
}

export async function addPageView(id: number): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(ADD_PAGE_VIEW, {
    id,
  });
  return data;
}
