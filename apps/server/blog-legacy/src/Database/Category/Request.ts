import {type Category, type ServerResponse} from '@module/classes';

import {axiosInstance} from '../CONFIG.js';
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
  const {data} = await axiosInstance.get<ServerResponse<Category[]>>(GET, {
    params: {
      json: JSON.stringify(category),
    },
  });
  return data;
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  const {data} = await axiosInstance.get<ServerResponse<Category[]>>(GET_ALL);
  return data;
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(ADD, category);
  return data;
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(DELETE_BY_ID, {
    id,
  });
  return data;
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(
    MODIFY,
    category,
  );
  return data;
}

export async function countArticleById(
  id: number,
): Promise<ServerResponse<number>> {
  const {data} = await axiosInstance.get<ServerResponse<number>>(
    COUNT_ARTICLE_BY_ID,
    {
      params: {
        json: JSON.stringify({id}),
      },
    },
  );
  return data;
}
